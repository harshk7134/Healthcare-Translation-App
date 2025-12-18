import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

class TranslationService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.PERPLEXITY_API_KEY,
      baseURL: "https://api.perplexity.ai"
    });
  }

  /**
   * Translate text using OpenAI GPT-4
   * Enhanced for medical terminology accuracy
   */
  async translateText(text, sourceLang, targetLang) {
    try {
      const prompt = `You are a professional medical translator. Translate the following text from ${sourceLang} to ${targetLang}. 
      Ensure medical terminology is accurate and culturally appropriate for healthcare contexts.
      Maintain the tone and urgency of the original message.
      
      Text to translate: "${text}"
      
      Provide only the translation without any additional explanation.`;

      const completion = await this.openai.chat.completions.create({
        model: "sonar-pro",
        messages: [
          {
            role: "system",
            content: "You are an expert medical translator specializing in patient-provider communication. Your translations are accurate, culturally sensitive, and preserve medical terminology."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3, // Lower temperature for more consistent translations
        max_tokens: 1000
      });

      return {
        translatedText: completion.choices[0].message.content.trim(),
        sourceLang,
        targetLang,
        originalText: text
      };
    } catch (error) {
      console.error('Translation error:', error);
      throw new Error(`Translation failed: ${error.message}`);
    }
  }

  /**
   * Detect language of input text
   */
  async detectLanguage(text) {
    try {
      const completion = await this.openai.chat.completions.create({
        model: "sonar-pro",
        messages: [
          {
            role: "user",
            content: `Detect the language of this text and respond with only the language name in English: "${text}"`
          }
        ],
        temperature: 0.1,
        max_tokens: 50
      });

      return completion.choices[0].message.content.trim();
    } catch (error) {
      console.error('Language detection error:', error);
      return 'Unknown';
    }
  }

  /**
   * Enhance transcription for medical terms
   */
  async enhanceTranscription(text) {
    try {
      const completion = await this.openai.chat.completions.create({
        model: "sonar-pro",
        messages: [
          {
            role: "system",
            content: "You are a medical transcription expert. Correct any obvious errors in the transcribed text, especially medical terms, while preserving the original meaning. If the text is already correct, return it unchanged."
          },
          {
            role: "user",
            content: text
          }
        ],
        temperature: 0.2,
        max_tokens: 1000
      });

      return completion.choices[0].message.content.trim();
    } catch (error) {
      console.error('Transcription enhancement error:', error);
      return text; // Return original if enhancement fails
    }
  }
}

export default new TranslationService();
