const express = require('express');
const {
  getFAQs,
  createFAQ,
  updateFAQ,
  deleteFAQ,
} = require('../controllers/faqController');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/adminOnly');

const router = express.Router();

router.route('/')
  .get(getFAQs)
  .post(protect, adminOnly, createFAQ);

router.route('/:id')
  .put(protect, adminOnly, updateFAQ)
  .delete(protect, adminOnly, deleteFAQ);

module.exports = router;
