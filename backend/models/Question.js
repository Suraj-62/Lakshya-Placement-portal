import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
  topic: String,
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true, index: true },
  questionText: { type: String, required: true },
  options: [String],
  correctAnswer: { type: String, required: true },
  explanation: String,
  type: { type: String, enum: ['mcq', 'code', 'text'], default: 'mcq' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isAIGenerated: { type: Boolean, default: false },
}, { timestamps: true });

questionSchema.index({ category: 1, difficulty: 1 });

questionSchema.pre('remove', async function(next) {
  await mongoose.model('Attempt').deleteMany({ question: this._id });
  next();
});

export default mongoose.model('Question', questionSchema);