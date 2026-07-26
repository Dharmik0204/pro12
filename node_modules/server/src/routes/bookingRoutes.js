const express = require('express');
const {
  createBooking,
  getMyBookings,
  getBookingById,
  getAllBookings,
  updateBookingStatus,
} = require('../controllers/bookingController');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/adminOnly');

const router = express.Router();

router.route('/')
  .post(protect, createBooking)
  .get(protect, adminOnly, getAllBookings);

router.route('/my-bookings')
  .get(protect, getMyBookings);

router.route('/:id')
  .get(protect, getBookingById);

router.route('/:id/status')
  .patch(protect, adminOnly, updateBookingStatus);

module.exports = router;
