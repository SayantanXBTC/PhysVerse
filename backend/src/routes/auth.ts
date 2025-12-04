import { Router } from 'express';
import { 
  register, 
  login, 
  getMe,
  verifyEmail,
  resendVerification,
  forgotPassword,
  resetPassword,
  updateProfile,
  changePassword,
  deleteAccount,
  getUserStats
} from '../controllers/authController';
import { validate } from '../middleware/validate';
import { registerSchema, loginSchema } from '../validators/auth';
import { authenticate } from '../middleware/auth';

const router = Router();

// Public routes
router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/verify-email', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Protected routes
router.get('/me', authenticate, getMe);
router.get('/stats', authenticate, getUserStats);
router.post('/resend-verification', authenticate, resendVerification);
router.put('/profile', authenticate, updateProfile);
router.put('/change-password', authenticate, changePassword);
router.delete('/account', authenticate, deleteAccount);

export default router;
