const express = require('express');
const { body } = require('express-validator');
const {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  getUserProfile,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { loginLimiter } = require('../middleware/rateLimiter');
const { validateFields } = require('../middleware/validate');

const router = express.Router();

router.post(
  '/register',
  [
    body('name').notEmpty().withMessage('Name is required').trim(),
    body('email').isEmail().withMessage('Please provide a valid email address').trim(),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('phone').notEmpty().withMessage('Phone number is required').trim(),
  ],
  validateFields,
  registerUser
);

router.post(
  '/login',
  loginLimiter,
  [
    body('email').isEmail().withMessage('Please provide a valid email address').trim(),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validateFields,
  loginUser
);

router.post('/refresh-token', refreshAccessToken);
router.post('/logout', logoutUser);
router.get('/me', protect, getUserProfile);

module.exports = router;
