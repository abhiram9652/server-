import express from 'express';
import Translation from '../models/Translation.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/history
// @desc    Get user's translation history
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const translations = await Translation.find({ userId: req.user._id })
      .sort({ createdAt: -1 }) // Sort by most recent first
      .limit(50); // Limit to 50 most recent translations
    
    res.json(translations);
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/history
// @desc    Save a translation to history
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { sourceText, translatedText } = req.body;
    
    if (!sourceText || !translatedText) {
      return res.status(400).json({ message: 'Please provide source and translated text' });
    }
    
    const translation = await Translation.create({
      userId: req.user._id,
      sourceText,
      translatedText
    });
    
    res.status(201).json(translation);
  } catch (error) {
    console.error('Save translation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/history/:id
// @desc    Delete a translation from history
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const translation = await Translation.findById(req.params.id);
    
    if (!translation) {
      return res.status(404).json({ message: 'Translation not found' });
    }
    
    // Check if translation belongs to user
    if (translation.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    await translation.deleteOne();
    
    res.json({ message: 'Translation deleted' });
  } catch (error) {
    console.error('Delete translation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/history
// @desc    Clear all translations from history
// @access  Private
router.delete('/', protect, async (req, res) => {
  try {
    await Translation.deleteMany({ userId: req.user._id });
    
    res.json({ message: 'Translation history cleared' });
  } catch (error) {
    console.error('Clear history error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;