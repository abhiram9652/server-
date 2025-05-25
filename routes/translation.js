import express from 'express';
import axios from 'axios';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/translate
// @desc    Translate text from English to Telugu
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ message: 'Please provide text to translate' });
    }
    
    // For development purposes, we'll simulate a translation
    // In production, this would connect to the Python translation service
    
    // Mock translation API call
    // const response = await axios.post('http://localhost:8000/translate', { text });
    // const translatedText = response.data.translatedText;
    
    // Simulate translation with delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Simple mock translation (just adds Telugu characters to show it's working)
    // In a real app, this would be a proper translation from the Python service
    const mockTranslation = `${text} (తెలుగులో: నకిలీ అనువాదం)`;
    
    res.json({ translatedText: mockTranslation });
  } catch (error) {
    console.error('Translation error:', error);
    res.status(500).json({ message: 'Translation service error' });
  }
});

export default router;