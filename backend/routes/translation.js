import express from 'express';
import translationService from '../services/translationService.js';

const router = express.Router();

/**
 * POST /api/translation/translate
 * Translate text from one language to another
 */
router.post('/translate', async (req, res) => {
  try {
    const { text, sourceLang, targetLang } = req.body;

    // Validation
    if (!text || !sourceLang || !targetLang) {
      return res.status(400).json({
        error: 'Missing required fields: text, sourceLang, targetLang'
      });
    }

    if (text.length > 5000) {
      return res.status(400).json({
        error: 'Text exceeds maximum length of 5000 characters'
      });
    }

    const result = await translationService.translateText(text, sourceLang, targetLang);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Translation route error:', error);
    res.status(500).json({
      success: false,
      error: 'Translation failed',
      message: error.message
    });
  }
});

/**
 * POST /api/translation/detect
 * Detect language of input text
 */
router.post('/detect', async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        error: 'Text is required'
      });
    }

    const language = await translationService.detectLanguage(text);
    
    res.json({
      success: true,
      data: { language }
    });
  } catch (error) {
    console.error('Language detection error:', error);
    res.status(500).json({
      success: false,
      error: 'Language detection failed',
      message: error.message
    });
  }
});

/**
 * POST /api/translation/enhance
 * Enhance transcription with medical terminology
 */
router.post('/enhance', async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        error: 'Text is required'
      });
    }

    const enhancedText = await translationService.enhanceTranscription(text);
    
    res.json({
      success: true,
      data: { enhancedText, originalText: text }
    });
  } catch (error) {
    console.error('Enhancement error:', error);
    res.status(500).json({
      success: false,
      error: 'Text enhancement failed',
      message: error.message
    });
  }
});

export default router;
