const FAQ = require('../models/FAQ');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get all FAQs
// @route   GET /api/faqs
// @access  Public
const getFAQs = asyncHandler(async (req, res) => {
  const faqs = await FAQ.find({}).sort({ order: 1, topic: 1 });
  res.status(200).json({
    success: true,
    data: faqs,
  });
});

// @desc    Create FAQ (admin only)
// @route   POST /api/faqs
// @access  Private/Admin
const createFAQ = asyncHandler(async (req, res) => {
  const { topic, question, answer, order } = req.body;

  const faq = await FAQ.create({
    topic,
    question,
    answer,
    order: order || 0,
  });

  res.status(201).json({
    success: true,
    data: faq,
    message: 'FAQ created successfully',
  });
});

// @desc    Update FAQ (admin only)
// @route   PUT /api/faqs/:id
// @access  Private/Admin
const updateFAQ = asyncHandler(async (req, res) => {
  const faq = await FAQ.findById(req.params.id);

  if (!faq) {
    res.status(404);
    throw new Error('FAQ not found');
  }

  const updatedFAQ = await FAQ.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: updatedFAQ,
    message: 'FAQ updated successfully',
  });
});

// @desc    Delete FAQ (admin only)
// @route   DELETE /api/faqs/:id
// @access  Private/Admin
const deleteFAQ = asyncHandler(async (req, res) => {
  const faq = await FAQ.findById(req.params.id);

  if (!faq) {
    res.status(404);
    throw new Error('FAQ not found');
  }

  await FAQ.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: 'FAQ deleted successfully',
  });
});

module.exports = {
  getFAQs,
  createFAQ,
  updateFAQ,
  deleteFAQ,
};
