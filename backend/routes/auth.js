import express from 'express';
import { registerUser, loginUser, logoutUser, getUserProfile,forgotPassword,resetPassword, googleLogin } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { validateRegister, validateLogin, handleValidationErrors } from '../middleware/validation.js';

const router = express.Router();

router.post('/register', validateRegister, handleValidationErrors, registerUser);
router.post('/login', validateLogin, handleValidationErrors, loginUser);
router.post('/logout', logoutUser);
router.get('/me', protect, getUserProfile);
router.post('/forgot', forgotPassword);
router.put('/reset/:token', resetPassword);
router.post('/reset/:token', resetPassword);
router.post('/google', googleLogin);

export default router;