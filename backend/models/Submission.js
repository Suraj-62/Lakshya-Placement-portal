import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true,
    index: true
  },
  code: {
    type: String,
    required: true
  },
  language: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Accepted', 'Wrong Answer', 'Compile Error', 'Runtime Error', 'Time Limit Exceeded', 'Memory Limit Exceeded'],
    required: true
  },
  passedCount: {
    type: Number,
    default: 0
  },
  totalCount: {
    type: Number,
    required: true
  },
  results: [Object], // Detailed results per test case
  executionTime: Number,
  pointsEarned: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

// Index for getting latest submissions
submissionSchema.index({ user: 1, createdAt: -1 });

export default mongoose.models.Submission || mongoose.model('Submission', submissionSchema);
