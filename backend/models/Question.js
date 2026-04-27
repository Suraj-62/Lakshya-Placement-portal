import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
  topic: String,
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true, index: true },
  questionText: { type: String, required: true },
  options: [String], // Still used for MCQs
  correctAnswer: { type: String, required: function() { return this.type === 'mcq'; } },
  explanation: String,
  type: { type: String, enum: ['mcq', 'code', 'text'], default: 'mcq' },
  testCases: [{
    input: String,
    output: String,
    explanation: String,
    imageUrl: String,
    isHidden: { type: Boolean, default: false }
  }],
  starterCode: {
    cpp: String,
    java: String,
    python: String,
    javascript: String
  },
  functionName: String,
  constraints: String,
  drivers: {
    cpp: String,
    java: String,
    python: String,
    javascript: String
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isAIGenerated: { type: Boolean, default: false },
}, { timestamps: true });

questionSchema.index({ category: 1, difficulty: 1 });

questionSchema.pre('remove', async function(next) {
  await mongoose.model('Attempt').deleteMany({ question: this._id });
  next();
});

export default mongoose.model('Question', questionSchema);