import React from 'react';
import '../styles/App.css';

const TranscriptBox = ({ title, content, interimContent, language, onSpeak, isSpeaking }) => {
  const hasContent = content || interimContent;

  return (
    <div className="transcript-box">
      <div className="transcript-header">
        <h3>
          <span className="icon">🗣️</span>
          {title}
        </h3>
        {hasContent && (
          <button
            className={`speak-btn ${isSpeaking ? 'speaking' : ''}`}
            onClick={() => onSpeak(content)}
            disabled={!content || isSpeaking}
            title="Play audio"
          >
            <span className="icon">🔊</span>
            {isSpeaking ? 'Playing...' : 'Speak'}
          </button>
        )}
      </div>
      <div className={`transcript-content ${!hasContent ? 'empty' : ''}`}>
        {content && <div className="final-text">{content}</div>}
        {interimContent && <div className="interim-text">{interimContent}</div>}
        {!hasContent && <div>Waiting for speech input...</div>}
      </div>
    </div>
  );
};

export default TranscriptBox;
