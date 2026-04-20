import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },

  email: { type: String, required: true, unique: true },

  password: { type: String, required: true },

  role: {
    type: String,
    enum: ['student', 'admin'],
    default: 'student'
  },

  avatar: {
    type: String,
    default: ''
  },

  // 🔥 ADD THESE (IMPORTANT)
  resetToken: String,
  resetTokenExpire: Date,

  // 🏆 Gamification & Analytics
  points: { type: Number, default: 0 },
  streak: { type: Number, default: 0 },
  lastActiveDate: { type: Date },
  badges: [{ type: String }],
  totalCorrect: { type: Number, default: 0 },
  totalAttempts: { type: Number, default: 0 },
  solvedCodingQuestions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],

  // 📌 Bookmarks
  bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],

  isBlocked: { type: Boolean, default: false }

}, { timestamps: true });

// 🔐 HASH PASSWORD & NORMALIZE EMAIL
userSchema.pre('save', async function(next) {
  if (this.isModified('email')) {
    this.email = this.email.toLowerCase();
  }

  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

// 🔐 MATCH PASSWORD
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);