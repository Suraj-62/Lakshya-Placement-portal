import mongoose from 'mongoose';

const attemptSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
  selectedAnswer: String,
  isCorrect: Boolean,
}, { timestamps: true });

attemptSchema.index({ user: 1, createdAt: -1 });

export default mongoose.model('Attempt', attemptSchema);