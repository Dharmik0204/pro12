const Booking = require('../models/Booking');
const Package = require('../models/Package');
const asyncHandler = require('../utils/asyncHandler');
const nodemailer = require('nodemailer');

// Helper to send email (fails gracefully if email is not configured)
const sendConfirmationEmail = async (booking, user) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log('Email credentials not set. Skipping booking confirmation email.');
      return;
    }

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.mailtrap.io',
      port: 587,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Dhanish Travel Co." <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: `Booking Confirmed - Ref: ${booking.bookingRef}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h2 style="color: #0B2447; text-align: center;">Dhanish Travel Co.</h2>
          <h3 style="color: #0D3B66;">Booking Confirmation</h3>
          <p>Dear ${user.name},</p>
          <p>Thank you for choosing Dhanish Travel Co. Your booking has been successfully placed.</p>
          
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr style="background-color: #f8f9fa;">
              <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Booking Ref</th>
              <td style="padding: 10px; border: 1px solid #ddd;">${booking.bookingRef}</td>
            </tr>
            <tr>
              <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Total Amount</th>
              <td style="padding: 10px; border: 1px solid #ddd;">INR ${booking.totalAmount}</td>
            </tr>
            <tr style="background-color: #f8f9fa;">
              <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Payment Status</th>
              <td style="padding: 10px; border: 1px solid #ddd; text-transform: uppercase;">${booking.paymentStatus}</td>
            </tr>
            <tr>
              <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Booking Status</th>
              <td style="padding: 10px; border: 1px solid #ddd; text-transform: uppercase;">${booking.bookingStatus}</td>
            </tr>
          </table>

          <p>Our travel experts will contact you shortly with the final itinerary details and travel vouchers.</p>
          <p>If you have any questions, feel free to contact us via support or WhatsApp.</p>
          
          <hr style="border: 0; border-top: 1px solid #e0e0e0; margin: 20px 0;" />
          <p style="font-size: 12px; color: #777; text-align: center;">
            Dhanish Travel Co. &copy; 2026. All Rights Reserved.
          </p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Confirmation email sent: ${info.messageId}`);
  } catch (error) {
    console.error('Nodemailer Error:', error.message);
  }
};

// @desc    Create a new booking (recalculates totals server-side)
// @route   POST /api/bookings
// @access  Private
const createBooking = asyncHandler(async (req, res) => {
  const { packageId, travelDate, travelers, addons } = req.body;

  if (!packageId || !travelDate || !travelers || travelers.length === 0) {
    res.status(400);
    throw new Error('Required booking fields are missing');
  }

  // Fetch package to get official pricing
  const packageItem = await Package.findById(packageId);
  if (!packageItem) {
    res.status(404);
    throw new Error('Selected package not found');
  }

  const basePrice = packageItem.discountPrice > 0 ? packageItem.discountPrice : packageItem.price;
  const numTravelers = travelers.length;
  
  const packageCost = basePrice * numTravelers;

  let addonCost = 0;
  if (addons && addons.length > 0) {
    addonCost = addons.reduce((sum, item) => sum + (item.price || 0), 0);
  }

  const extraTravelerCost = 0;
  const totalAmount = packageCost + addonCost + extraTravelerCost;

  const booking = await Booking.create({
    user: req.user._id,
    package: packageId,
    travelDate,
    travelers,
    addons,
    packageCost,
    addonCost,
    extraTravelerCost,
    totalAmount,
    paymentStatus: 'pending',
    bookingStatus: 'pending',
  });

  res.status(201).json({
    success: true,
    data: booking,
    message: 'Booking created successfully. Proceed to payment.',
  });
});

// @desc    Get logged in user's bookings
// @route   GET /api/bookings/my-bookings
// @access  Private
const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id })
    .populate('package', 'title slug duration images price destinationRoute')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: bookings,
  });
});

// @desc    Get booking by ID (owner or admin)
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate('user', 'name email phone')
    .populate('package');

  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  if (booking.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to view this booking');
  }

  res.status(200).json({
    success: true,
    data: booking,
  });
});

// @desc    Get all bookings (admin only)
// @route   GET /api/bookings
// @access  Private/Admin
const getAllBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({})
    .populate('user', 'name email phone')
    .populate('package', 'title category price destinationRoute')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: bookings,
  });
});

// @desc    Update booking status (admin only)
// @route   PATCH /api/bookings/:id/status
// @access  Private/Admin
const updateBookingStatus = asyncHandler(async (req, res) => {
  const { bookingStatus, paymentStatus, status } = req.body;
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  const targetStatus = bookingStatus || status;
  if (targetStatus) {
    booking.bookingStatus = targetStatus;
    if (targetStatus === 'cancelled') {
      booking.paymentStatus = 'cancelled';
    }
  }

  if (paymentStatus) {
    booking.paymentStatus = paymentStatus;
  }

  const updatedBooking = await booking.save();

  if (paymentStatus === 'paid' || targetStatus === 'confirmed') {
    try {
      const populated = await Booking.findById(updatedBooking._id).populate('user', 'name email');
      if (populated && populated.user) {
        sendConfirmationEmail(populated, populated.user);
      }
    } catch (e) {
      console.error('Email notification failed gracefully:', e.message);
    }
  }

  res.status(200).json({
    success: true,
    data: updatedBooking,
    message: 'Booking status updated successfully',
  });
});

module.exports = {
  createBooking,
  getMyBookings,
  getBookingById,
  getAllBookings,
  updateBookingStatus,
  sendConfirmationEmail,
};
