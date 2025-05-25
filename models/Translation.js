import mongoose from 'mongoose';

const translationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sourceText: {
    type: String,
    required: true
  },
  translatedText: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
translationSchema.index({ userId: 1, createdAt: -1 });

const Translation = mongoose.model('Translation', translationSchema);

export default Translation;