import mongoose from 'mongoose';

const examSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
  answers: [{
    question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
    selectedAnswer: String,
    isCorrect: Boolean,
  }],
  startTime: { type: Date, default: Date.now },
  duration: { type: Number, required: true, default: 30 }, // minutes
  endTime: { type: Date },
  tabSwitchCount: { type: Number, default: 0 },
  status: { type: String, enum: ['ongoing', 'completed', 'terminated'], default: 'ongoing' },
  score: Number,
}, { timestamps: true });

export default mongoose.model('Exam', examSchema);