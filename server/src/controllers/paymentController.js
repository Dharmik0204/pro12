const crypto = require('crypto');
const Razorpay = require('razorpay');
const Booking = require('../models/Booking');
const User = require('../models/User');
const { sendConfirmationEmail } = require('./bookingController');
const asyncHandler = require('../utils/asyncHandler');

// Clean credentials helper
const getCleanRazorpayKeyId = () => {
  let keyId = process.env.RAZORPAY_KEY_ID || '';
  if (keyId.startsWith('rzp_test_rzp_test_')) {
    keyId = keyId.replace('rzp_test_rzp_test_', 'rzp_test_');
  }
  return keyId;
};

// Check if credentials exist and are valid
const hasRazorpayConfig = () => {
  const id = getCleanRazorpayKeyId();
  const secret = process.env.RAZORPAY_KEY_SECRET;
  return Boolean(id && secret && !id.startsWith('your_') && !secret.startsWith('your_'));
};

let razorpayInstance = null;
const cleanKeyId = getCleanRazorpayKeyId();
const keySecret = process.env.RAZORPAY_KEY_SECRET;

if (hasRazorpayConfig()) {
  try {
    razorpayInstance = new Razorpay({
      key_id: cleanKeyId,
      key_secret: keySecret,
    });
    console.log('✅ Real-time Razorpay Payment Gateway initialized with Key ID:', cleanKeyId);
  } catch (error) {
    console.error('❌ Failed to initialize Razorpay SDK:', error.message);
  }
} else {
  console.log('ℹ️ Razorpay credentials not configured. Running Payments in Sandbox/Simulation mode.');
}

// @desc    Create Razorpay Order
// @route   POST /api/payments/create-order
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
  const { bookingId } = req.body;

  if (!bookingId) {
    res.status(400);
    throw new Error('Booking ID is required');
  }

  const booking = await Booking.findById(bookingId);
  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  const amountInPaise = Math.round(booking.totalAmount * 100);

  // If Razorpay SDK is active
  if (razorpayInstance) {
    try {
      const options = {
        amount: amountInPaise,
        currency: 'INR',
        receipt: booking.bookingRef || `rec_${Date.now()}`,
      };

      const order = await razorpayInstance.orders.create(options);

      return res.status(200).json({
        success: true,
        data: {
          id: order.id,
          amount: order.amount,
          currency: order.currency,
          bookingId: booking._id,
          bookingRef: booking.bookingRef,
          key: cleanKeyId,
          isMock: false,
        },
      });
    } catch (error) {
      console.error('Razorpay Order Creation Error:', error.message);
      // If live fails (e.g. invalid key pair), throw explicit error so user knows
      res.status(400);
      throw new Error(`Razorpay Order Creation Failed: ${error.message}`);
    }
  }

  // Simulation fallback order response
  const mockOrderId = `order_mock_${Math.random().toString(36).substring(2, 11)}`;
  res.status(200).json({
    success: true,
    data: {
      id: mockOrderId,
      amount: amountInPaise,
      currency: 'INR',
      bookingId: booking._id,
      bookingRef: booking.bookingRef,
      isMock: true,
      key: 'mock_key_id',
    },
    message: 'Simulation order generated (Sandbox mode)',
  });
});

// @desc    Verify payment signature & update booking
// @route   POST /api/payments/verify
// @access  Private
const verifyPayment = asyncHandler(async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    bookingId,
    isMock,
  } = req.body;

  if (!bookingId) {
    res.status(400);
    throw new Error('Booking ID is required for verification');
  }

  const booking = await Booking.findById(bookingId);
  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  // Handle live signature verification
  if (!isMock && hasRazorpayConfig() && razorpay_signature) {
    const text = `${razorpay_order_id}|${razorpay_payment_id}`;
    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(text)
      .digest('hex');

    if (generated_signature !== razorpay_signature) {
      booking.paymentStatus = 'failed';
      await booking.save();
      res.status(400);
      throw new Error('Payment signature verification failed');
    }
  }

  // Success path: Update booking and send email
  booking.paymentStatus = 'paid';
  booking.paymentId = razorpay_payment_id || `pay_mock_${Math.random().toString(36).substring(2, 11)}`;
  booking.bookingStatus = 'confirmed';
  await booking.save();

  const user = await User.findById(booking.user);
  if (user) {
    await sendConfirmationEmail(booking, user);
  }

  res.status(200).json({
    success: true,
    data: booking,
    message: 'Payment verified and booking confirmed successfully',
  });
});

module.exports = {
  createOrder,
  verifyPayment,
};
