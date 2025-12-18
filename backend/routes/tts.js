import express from 'express';
import ttsService from '../services/ttsService.js';

const router = express.Router();

/**
 * POST /api/tts/speak
 * Convert text to speech
 */
router.post('/speak', async (req, res) => {
  try {
    const { text, language } = req.body;

    if (!text) {
      return res.status(400).json({
        error: 'Text is required'
      });
    }

    if (text.length > 4096) {
      return res.status(400).json({
        error: 'Text exceeds maximum length of 4096 characters for TTS'
      });
    }

    const audioBase64 = await ttsService.textToSpeechBase64(text, language || 'en');
    
    res.json({
      success: true,
      data: {
        audio: audioBase64,
        format: 'mp3'
      }
    });
  } catch (error) {
    console.error('TTS route error:', error);
    res.status(500).json({
      success: false,
      error: 'Text-to-speech conversion failed',
      message: error.message
    });
  }
});

/**
 * POST /api/tts/speak-stream
 * Stream audio directly (alternative endpoint)
 */
router.post('/speak-stream', async (req, res) => {
  try {
    const { text, language } = req.body;

    if (!text) {
      return res.status(400).json({
        error: 'Text is required'
      });
    }

    const audioBuffer = await ttsService.textToSpeech(text, language || 'en');
    
    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Length': audioBuffer.length
    });
    
    res.send(audioBuffer);
  } catch (error) {
    console.error('TTS stream error:', error);
    res.status(500).json({
      success: false,
      error: 'Text-to-speech streaming failed',
      message: error.message
    });
  }
});

export default router;
