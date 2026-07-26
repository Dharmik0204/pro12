const express = require('express');
const { body } = require('express-validator');
const {
  createContactMessage,
  getMyContactMessages,
  getContactMessages,
  updateContactMessageStatus,
  deleteContactMessage,
} = require('../controllers/contactController');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/adminOnly');
const { contactLimiter } = require('../middleware/rateLimiter');
const { validateFields } = require('../middleware/validate');

const router = express.Router();

router.get('/my-inquiries', protect, getMyContactMessages);

router.route('/')
  .post(
    contactLimiter,
    [
      body('name').notEmpty().withMessage('Name is required').trim(),
      body('email').isEmail().withMessage('Invalid email address').normalizeEmail(),
      body('phone').notEmpty().withMessage('Phone number is required').trim(),
      body('subject').notEmpty().withMessage('Subject is required').trim(),
      body('message').notEmpty().withMessage('Message is required').trim(),
    ],
    validateFields,
    createContactMessage
  )
  .get(protect, adminOnly, getContactMessages);

router.route('/:id')
  .patch(protect, adminOnly, updateContactMessageStatus)
  .delete(protect, adminOnly, deleteContactMessage);

module.exports = router;
