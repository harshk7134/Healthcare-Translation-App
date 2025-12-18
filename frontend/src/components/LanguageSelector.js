import React from 'react';

const LanguageSelector = ({ 
  sourceLanguage, 
  targetLanguage, 
  onSourceChange, 
  onTargetChange, 
  onSwap 
}) => {
  const languages = [
    'English',
    'Spanish',
    'French',
    'German',
    'Chinese',
    'Japanese',
    'Korean',
    'Arabic',
    'Hindi',
    'Portuguese',
    'Russian',
    'Italian',
  ];

  return (
    <div className="language-selector">
      <div className="language-group">
        <label htmlFor="source-lang">FROM</label>
        <select
          id="source-lang"
          value={sourceLanguage}
          onChange={(e) => onSourceChange(e.target.value)}
        >
          {languages.map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>
      </div>

      <button
        className="swap-button"
        onClick={onSwap}
        title="Swap languages"
        aria-label="Swap languages"
      >
        ⇄
      </button>

      <div className="language-group">
        <label htmlFor="target-lang">TO</label>
        <select
          id="target-lang"
          value={targetLanguage}
          onChange={(e) => onTargetChange(e.target.value)}
        >
          {languages.map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default LanguageSelector;
