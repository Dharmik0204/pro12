const Testimonial = require('../models/Testimonial');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get all approved testimonials
// @route   GET /api/testimonials
// @access  Public
const getTestimonials = asyncHandler(async (req, res) => {
  const testimonials = await Testimonial.find({ isApproved: true }).sort({ createdAt: -1 });
  res.status(200).json({
    success: true,
    data: testimonials,
  });
});

// @desc    Create a testimonial
// @route   POST /api/testimonials
// @access  Private
const createTestimonial = asyncHandler(async (req, res) => {
  const { name, location, rating, message, image, tourTaken, source, videoUrl } = req.body;

  // Auto-approve if writer is admin
  const isApproved = req.user && req.user.role === 'admin';

  const testimonial = await Testimonial.create({
    name,
    location,
    rating,
    message,
    image,
    tourTaken,
    source: source || 'website',
    videoUrl,
    isApproved,
  });

  res.status(201).json({
    success: true,
    data: testimonial,
    message: isApproved ? 'Testimonial posted successfully' : 'Testimonial submitted and awaiting approval',
  });
});

// @desc    Get all testimonials (admin panel view)
// @route   GET /api/testimonials/admin
// @access  Private/Admin
const getAllTestimonialsAdmin = asyncHandler(async (req, res) => {
  const testimonials = await Testimonial.find({}).sort({ createdAt: -1 });
  res.status(200).json({
    success: true,
    data: testimonials,
  });
});

// @desc    Approve/Reject/Edit testimonial (admin only)
// @route   PUT /api/testimonials/:id
// @access  Private/Admin
const updateTestimonialAdmin = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.findById(req.params.id);

  if (!testimonial) {
    res.status(404);
    throw new Error('Testimonial not found');
  }

  const updatedTestimonial = await Testimonial.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    data: updatedTestimonial,
    message: 'Testimonial updated successfully',
  });
});

// @desc    Delete testimonial (admin only)
// @route   DELETE /api/testimonials/:id
// @access  Private/Admin
const deleteTestimonialAdmin = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.findById(req.params.id);

  if (!testimonial) {
    res.status(404);
    throw new Error('Testimonial not found');
  }

  await Testimonial.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Testimonial deleted successfully',
  });
});

module.exports = {
  getTestimonials,
  createTestimonial,
  getAllTestimonialsAdmin,
  updateTestimonialAdmin,
  deleteTestimonialAdmin,
};
