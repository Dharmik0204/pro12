const express = require('express');
const {
  getTestimonials,
  createTestimonial,
  getAllTestimonialsAdmin,
  updateTestimonialAdmin,
  deleteTestimonialAdmin,
} = require('../controllers/testimonialController');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/adminOnly');

const router = express.Router();

router.route('/')
  .get(getTestimonials)
  .post(protect, createTestimonial);

router.route('/admin')
  .get(protect, adminOnly, getAllTestimonialsAdmin);

router.route('/:id')
  .put(protect, adminOnly, updateTestimonialAdmin)
  .patch(protect, adminOnly, updateTestimonialAdmin)
  .delete(protect, adminOnly, deleteTestimonialAdmin);

router.route('/:id/approve')
  .patch(protect, adminOnly, updateTestimonialAdmin);

module.exports = router;
