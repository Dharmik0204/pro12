const Service = require('../models/Service');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get all services
// @route   GET /api/services
// @access  Public
const getServices = asyncHandler(async (req, res) => {
  const services = await Service.find({}).sort({ createdAt: -1 });
  res.status(200).json({
    success: true,
    data: services,
  });
});

// @desc    Create service (Admin only)
// @route   POST /api/services
// @access  Private/Admin
const createService = asyncHandler(async (req, res) => {
  const { title, desc, icon, category, isActive } = req.body;

  const service = await Service.create({
    title,
    desc,
    icon: icon || 'Compass',
    category: category || 'General',
    isActive: isActive !== undefined ? isActive : true,
  });

  res.status(201).json({
    success: true,
    data: service,
    message: 'Service created successfully',
  });
});

// @desc    Update service (Admin only)
// @route   PUT /api/services/:id
// @access  Private/Admin
const updateService = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);

  if (!service) {
    res.status(404);
    throw new Error('Service not found');
  }

  const updatedService = await Service.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    data: updatedService,
    message: 'Service updated successfully',
  });
});

// @desc    Delete service (Admin only)
// @route   DELETE /api/services/:id
// @access  Private/Admin
const deleteService = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);

  if (!service) {
    res.status(404);
    throw new Error('Service not found');
  }

  await Service.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Service deleted successfully',
  });
});

module.exports = {
  getServices,
  createService,
  updateService,
  deleteService,
};
