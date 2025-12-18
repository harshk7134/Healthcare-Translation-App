class SpeechRecognitionService {
  constructor() {
    // Check if browser supports Web Speech API
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.isSupported = true;
    } else {
      this.isSupported = false;
      console.warn('Speech Recognition API not supported in this browser');
    }
    
    this.isListening = false;
  }

  startListening(language, onResult, onEnd, onError) {
    if (!this.isSupported) {
      onError(new Error('Speech recognition is not supported in your browser'));
      return;
    }

    if (this.isListening) {
      return;
    }

    // Set language
    this.recognition.lang = this.getLanguageCode(language);

    // Handle results
    this.recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        } else {
          interimTranscript += transcript;
        }
      }

      onResult({
        final: finalTranscript.trim(),
        interim: interimTranscript.trim(),
        isFinal: finalTranscript.length > 0
      });
    };

    // Handle end
    this.recognition.onend = () => {
      this.isListening = false;
      if (onEnd) onEnd();
    };

    // Handle errors
    this.recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      this.isListening = false;
      if (onError) {
        onError(new Error(`Speech recognition error: ${event.error}`));
      }
    };

    // Start recognition
    try {
      this.recognition.start();
      this.isListening = true;
    } catch (error) {
      console.error('Failed to start recognition:', error);
      if (onError) onError(error);
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  getLanguageCode(language) {
    const languageCodes = {
      'English': 'en-US',
      'Spanish': 'es-ES',
      'French': 'fr-FR',
      'German': 'de-DE',
      'Chinese': 'zh-CN',
      'Japanese': 'ja-JP',
      'Korean': 'ko-KR',
      'Arabic': 'ar-SA',
      'Hindi': 'hi-IN',
      'Portuguese': 'pt-BR',
      'Russian': 'ru-RU',
      'Italian': 'it-IT',
    };

    return languageCodes[language] || 'en-US';
  }

  getShortLanguageCode(language) {
    const shortCodes = {
      'English': 'en',
      'Spanish': 'es',
      'French': 'fr',
      'German': 'de',
      'Chinese': 'zh',
      'Japanese': 'ja',
      'Korean': 'ko',
      'Arabic': 'ar',
      'Hindi': 'hi',
      'Portuguese': 'pt',
      'Russian': 'ru',
      'Italian': 'it',
    };

    return shortCodes[language] || 'en';
  }
}

export default new SpeechRecognitionService();
