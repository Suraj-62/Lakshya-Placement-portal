import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { OAuth2Client } from 'google-auth-library';


// ✅ REGISTER
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ name, email, password });

    generateToken(res, user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });

  } catch (error) {
    next(error);
  }
};

// ✅ LOGIN
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {

      // STREAK LOGIC
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (!user.lastActiveDate) {
        user.streak = 1;
      } else {
        const lastActive = new Date(user.lastActiveDate);
        lastActive.setHours(0, 0, 0, 0);
        const diffTime = today - lastActive;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          user.streak += 1;
        } else if (diffDays > 1) {
          user.streak = 1;
        }
      }
      user.lastActiveDate = new Date();
      await user.save();

      generateToken(res, user._id);

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });

    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }

  } catch (error) {
    next(error);
  }
};




// ✅ LOGOUT
export const logoutUser = (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
    sameSite: 'lax',
    secure: false,
  });

  res.json({ message: 'Logged out successfully' });
};


// ✅ GET PROFILE (🔥 ERROR FIX)
export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }

  } catch (error) {
    next(error);
  }
};


// ✅ FORGOT PASSWORD (EMAIL)
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const token = crypto.randomBytes(32).toString('hex');

  user.resetToken = token;
  user.resetTokenExpire = Date.now() + 10 * 60 * 1000;

  await user.save();

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASS,
    },
  });

  const link = `http://localhost:3000/auth/reset/${token}`;

  await transporter.sendMail({
    to: user.email,
    subject: 'Reset Password',
    html: `<h3>Click below to reset password</h3>
           <a href="${link}">${link}</a>`,
  });

  res.json({ message: "Reset link sent to email 📩" });
};


// ✅ RESET PASSWORD
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const user = await User.findOne({
    resetToken: token,
    resetTokenExpire: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ message: 'Invalid or expired token' });
  }

  user.password = password;
  user.resetToken = undefined;
  user.resetTokenExpire = undefined;

  await user.save();

  res.json({ message: "Password updated successfully ✅" });
};

// ✅ GOOGLE LOGIN
export const googleLogin = async (req, res, next) => {
  try {
    const { idToken } = req.body;
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { email, name, picture } = ticket.getPayload();

    let user = await User.findOne({ email });

    if (!user) {
      // Generate a secure random password for Google-authenticated users
      const generatedPassword = crypto.randomBytes(16).toString('hex');
      user = await User.create({
        name,
        email,
        password: generatedPassword,
        avatar: picture,
      });
    }

    // STREAK LOGIC
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!user.lastActiveDate) {
      user.streak = 1;
    } else {
      const lastActive = new Date(user.lastActiveDate);
      lastActive.setHours(0, 0, 0, 0);
      const diffTime = today - lastActive;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        user.streak += 1;
      } else if (diffDays > 1) {
        user.streak = 1;
      }
    }
    user.lastActiveDate = new Date();
    await user.save();

    generateToken(res, user._id);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
    });

  } catch (error) {
    console.error("Google Auth Error:", error);
    res.status(401).json({ message: 'Invalid Google Token' });
  }
};