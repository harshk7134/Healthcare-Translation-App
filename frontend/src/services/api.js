import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout
});

// Request interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    if (error.response) {
      // Server responded with error
      throw new Error(error.response.data.message || error.response.data.error || 'Server error');
    } else if (error.request) {
      // Request made but no response
      throw new Error('Network error. Please check your connection.');
    } else {
      // Something else happened
      throw new Error('An unexpected error occurred');
    }
  }
);

export const translationAPI = {
  translate: async (text, sourceLang, targetLang) => {
    const response = await api.post('/translation/translate', {
      text,
      sourceLang,
      targetLang,
    });
    return response.data;
  },

  detectLanguage: async (text) => {
    const response = await api.post('/translation/detect', { text });
    return response.data;
  },

  enhanceTranscription: async (text) => {
    const response = await api.post('/translation/enhance', { text });
    return response.data;
  },
};

export const ttsAPI = {
  speak: async (text, language) => {
    const response = await api.post('/tts/speak', {
      text,
      language,
    });
    return response.data;
  },

  speakStream: async (text, language) => {
    const response = await api.post('/tts/speak-stream', {
      text,
      language,
    }, {
      responseType: 'arraybuffer',
    });
    return response.data;
  },
};

export const healthCheck = async () => {
  const response = await api.get('/health');
  return response.data;
};

export default api;
