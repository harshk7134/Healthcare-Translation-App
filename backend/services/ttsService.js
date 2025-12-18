import OpenAI from 'openai';
import axios from 'axios';

class TextToSpeechService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.PERPLEXITY_API_KEY,
      baseURL: "https://api.perplexity.ai"
    });
  }

  /**
   * Convert text to speech using OpenAI TTS API
   */
  async textToSpeech(text, language = 'en') {
    try {
      // Map languages to appropriate voices
      const voiceMap = {
        'en': 'alloy',
        'es': 'nova',
        'fr': 'shimmer',
        'de': 'echo',
        'zh': 'fable',
        'default': 'alloy'
      };

      const voice = voiceMap[language] || voiceMap['default'];

      const mp3 = await this.openai.audio.speech.create({
        model: "tts-1",
        voice: voice,
        input: text,
        speed: 0.9 // Slightly slower for clarity
      });

      const buffer = Buffer.from(await mp3.arrayBuffer());
      return buffer;
    } catch (error) {
      console.error('Text-to-speech error:', error);
      throw new Error(`TTS conversion failed: ${error.message}`);
    }
  }

  /**
   * Get audio format as base64 for easier transmission
   */
  async textToSpeechBase64(text, language = 'en') {
    try {
      const buffer = await this.textToSpeech(text, language);
      return buffer.toString('base64');
    } catch (error) {
      throw error;
    }
  }
}

export default new TextToSpeechService();
