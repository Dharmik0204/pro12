const Setting = require('../models/Setting');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get site settings
// @route   GET /api/settings
// @access  Public
const getSettings = asyncHandler(async (req, res) => {
  let settings = await Setting.findOne();
  if (!settings) {
    settings = await Setting.create({});
  }
  res.status(200).json({
    success: true,
    data: settings,
  });
});

// @desc    Update site settings (Admin only)
// @route   PUT /api/settings
// @access  Private/Admin
const updateSettings = asyncHandler(async (req, res) => {
  let settings = await Setting.findOne();
  if (!settings) {
    settings = await Setting.create(req.body);
  } else {
    settings = await Setting.findByIdAndUpdate(settings._id, req.body, {
      new: true,
      runValidators: true,
    });
  }

  res.status(200).json({
    success: true,
    data: settings,
    message: 'Site settings updated successfully',
  });
});

module.exports = {
  getSettings,
  updateSettings,
};
