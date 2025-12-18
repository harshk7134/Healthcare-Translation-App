import React, { useState, useEffect, useRef } from 'react';
import './styles/App.css';
import LanguageSelector from './components/LanguageSelector';
import TranscriptBox from './components/TranscriptBox';
import speechRecognitionService from './services/speechRecognition';
import { translationAPI, ttsAPI } from './services/api';

function App() {
  // State management
  const [sourceLanguage, setSourceLanguage] = useState('English');
  const [targetLanguage, setTargetLanguage] = useState('Spanish');
  const [isListening, setIsListening] = useState(false);
  const [originalTranscript, setOriginalTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [statusType, setStatusType] = useState('info'); // info, success, error
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);

  // Refs
  const audioRef = useRef(null);
  const translationTimeoutRef = useRef(null);

  // Auto-translate when original transcript changes
  useEffect(() => {
    if (originalTranscript.trim()) {
      // Debounce translation to avoid too many API calls
      if (translationTimeoutRef.current) {
        clearTimeout(translationTimeoutRef.current);
      }

      translationTimeoutRef.current = setTimeout(() => {
        translateText(originalTranscript);
      }, 1000);
    }

    return () => {
      if (translationTimeoutRef.current) {
        clearTimeout(translationTimeoutRef.current);
      }
    };
  }, [originalTranscript, sourceLanguage, targetLanguage]);

  // Translate text function
  const translateText = async (text) => {
    if (!text.trim()) return;

    setIsTranslating(true);
    setStatusMessage('Translating...');
    setStatusType('info');

    try {
      const result = await translationAPI.translate(text, sourceLanguage, targetLanguage);
      setTranslatedText(result.data.translatedText);
      setStatusMessage('Translation complete');
      setStatusType('success');
      
      // Clear status message after 2 seconds
      setTimeout(() => {
        setStatusMessage('');
      }, 2000);
    } catch (error) {
      console.error('Translation error:', error);
      setStatusMessage(`Translation error: ${error.message}`);
      setStatusType('error');
    } finally {
      setIsTranslating(false);
    }
  };

  // Start listening
  const startListening = () => {
    if (!speechRecognitionService.isSupported) {
      setStatusMessage('Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.');
      setStatusType('error');
      return;
    }

    setStatusMessage('Listening... Speak now');
    setStatusType('info');

    speechRecognitionService.startListening(
      sourceLanguage,
      (result) => {
        // Handle speech recognition results
        if (result.isFinal && result.final) {
          setOriginalTranscript((prev) => {
            const newText = prev ? `${prev} ${result.final}` : result.final;
            return newText;
          });
          setInterimTranscript('');
        } else {
          setInterimTranscript(result.interim);
        }
      },
      () => {
        // On end
        setIsListening(false);
        setStatusMessage('Stopped listening');
        setStatusType('info');
        setTimeout(() => setStatusMessage(''), 2000);
      },
      (error) => {
        // On error
        setIsListening(false);
        setStatusMessage(`Error: ${error.message}`);
        setStatusType('error');
      }
    );

    setIsListening(true);
  };

  // Stop listening
  const stopListening = () => {
    speechRecognitionService.stopListening();
    setIsListening(false);
    setInterimTranscript('');
    setStatusMessage('Stopped listening');
    setStatusType('info');
    setTimeout(() => setStatusMessage(''), 2000);
  };

  // Clear all transcripts
  const clearTranscripts = () => {
    setOriginalTranscript('');
    setTranslatedText('');
    setInterimTranscript('');
    setStatusMessage('Transcripts cleared');
    setStatusType('info');
    setTimeout(() => setStatusMessage(''), 2000);
  };

  // Speak translated text
  const speakText = async (text) => {
    if (!text || isSpeaking) return;

    setIsSpeaking(true);
    setStatusMessage('Generating audio...');
    setStatusType('info');

    try {
      const langCode = speechRecognitionService.getShortLanguageCode(targetLanguage);
      const result = await ttsAPI.speak(text, langCode);

      // Convert base64 to audio and play
      const audioBlob = base64ToBlob(result.data.audio, 'audio/mpeg');
      const audioUrl = URL.createObjectURL(audioBlob);

      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.onended = () => {
          setIsSpeaking(false);
          setStatusMessage('Audio playback completed');
          setStatusType('success');
          setTimeout(() => setStatusMessage(''), 2000);
          URL.revokeObjectURL(audioUrl);
        };
        await audioRef.current.play();
        setStatusMessage('Playing audio...');
      }
    } catch (error) {
      console.error('TTS error:', error);
      setStatusMessage(`Audio error: ${error.message}`);
      setStatusType('error');
      setIsSpeaking(false);
    }
  };

  // Helper function to convert base64 to Blob
  const base64ToBlob = (base64, mimeType) => {
    const byteCharacters = atob(base64);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: mimeType });
  };

  // Swap languages
  const swapLanguages = () => {
    setSourceLanguage(targetLanguage);
    setTargetLanguage(sourceLanguage);
    setOriginalTranscript(translatedText);
    setTranslatedText(originalTranscript);
    setStatusMessage('Languages swapped');
    setStatusType('info');
    setTimeout(() => setStatusMessage(''), 2000);
  };

  return (
    <div className="app">
      <audio ref={audioRef} style={{ display: 'none' }} />
      
      <div className="container">
        <header className="header">
          <h1>🏥 Healthcare Translator</h1>
          <p>Real-time multilingual translation for patient-provider communication</p>
        </header>

        <div className="main-card">
          <LanguageSelector
            sourceLanguage={sourceLanguage}
            targetLanguage={targetLanguage}
            onSourceChange={setSourceLanguage}
            onTargetChange={setTargetLanguage}
            onSwap={swapLanguages}
          />

          <div className="controls">
            {!isListening ? (
              <button
                className="btn btn-primary"
                onClick={startListening}
              >
                <span className="icon">🎤</span>
                Start Listening
              </button>
            ) : (
              <button
                className="btn btn-danger listening"
                onClick={stopListening}
              >
                <span className="icon">⏹️</span>
                Stop Listening
              </button>
            )}

            <button
              className="btn btn-success"
              onClick={clearTranscripts}
              disabled={!originalTranscript && !translatedText}
            >
              <span className="icon">🗑️</span>
              Clear
            </button>
          </div>

          <div className="transcripts">
            <TranscriptBox
              title={`Original (${sourceLanguage})`}
              content={originalTranscript}
              interimContent={interimTranscript}
              language={sourceLanguage}
              onSpeak={() => {}}
              isSpeaking={false}
            />
            <TranscriptBox
              title={`Translation (${targetLanguage})`}
              content={translatedText}
              interimContent={isTranslating ? 'Translating...' : ''}
              language={targetLanguage}
              onSpeak={speakText}
              isSpeaking={isSpeaking}
            />
          </div>

          {statusMessage && (
            <div className="status-bar">
              <div className={`status-message ${statusType}`}>
                {(isTranslating || isSpeaking) && <span className="loading-spinner"></span>}
                {statusMessage}
              </div>
            </div>
          )}
        </div>

        <div className="header" style={{ marginTop: '30px', fontSize: '0.9rem' }}>
          <p>
            ⚕️ Designed for healthcare professionals and patients
            <br />
            🔒 Your conversations are processed securely
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
