const mongoose = require('mongoose');
const Destination = require('../models/Destination');
const asyncHandler = require('../utils/asyncHandler');

// Helper to build unique slug
const generateUniqueSlug = (text) => {
  const base = text ? text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') : 'destination';
  return `${base}-${Date.now().toString().slice(-4)}`;
};

// @desc    Get all destinations
// @route   GET /api/destinations
// @access  Public
const getDestinations = asyncHandler(async (req, res) => {
  const destinations = await Destination.find({})
    .populate('linkedPackages')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: destinations.length,
    data: destinations,
  });
});

// @desc    Get single destination by slug or ID
// @route   GET /api/destinations/:id
// @access  Public
const getDestinationBySlug = asyncHandler(async (req, res) => {
  const identifier = req.params.id;
  const isObjectId = mongoose.Types.ObjectId.isValid(identifier);

  const destination = await Destination.findOne({
    $or: isObjectId ? [{ _id: identifier }, { slug: identifier }] : [{ slug: identifier }],
  }).populate('linkedPackages');

  if (!destination) {
    res.status(404);
    throw new Error('Destination not found');
  }

  res.status(200).json({
    success: true,
    data: destination,
  });
});

// @desc    Create destination (Admin only)
// @route   POST /api/destinations
// @access  Private/Admin
const createDestination = asyncHandler(async (req, res) => {
  const { title, name, country, state, description, overview, image, images, topAttractions, thingsToDo, sampleItinerary, bestTimeToVisit } = req.body;

  const destName = name || title || 'New Destination';
  const destDescription = description || overview || 'Scenic travel destination.';
  const destCountry = country || 'India';
  const slug = generateUniqueSlug(destName);

  const imageList = Array.isArray(images) && images.length > 0
    ? images
    : (image ? [image] : ['https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=1000']);

  const destination = await Destination.create({
    name: destName,
    slug,
    country: destCountry,
    state: state || '',
    description: destDescription,
    images: imageList,
    topAttractions: topAttractions || ['Historical Monuments', 'Local Markets'],
    thingsToDo: thingsToDo || ['Sightseeing', 'Photography'],
    sampleItinerary: sampleItinerary || [],
    bestTimeToVisit: bestTimeToVisit || 'October to March',
  });

  res.status(201).json({
    success: true,
    data: destination,
    message: 'Destination created successfully',
  });
});

// @desc    Update destination (Admin only)
// @route   PUT /api/destinations/:id
// @access  Private/Admin
const updateDestination = asyncHandler(async (req, res) => {
  const destination = await Destination.findById(req.params.id);

  if (!destination) {
    res.status(404);
    throw new Error('Destination not found');
  }

  const updateData = { ...req.body };
  if (updateData.title && !updateData.name) {
    updateData.name = updateData.title;
  }
  if (updateData.name) {
    updateData.slug = generateUniqueSlug(updateData.name);
  }
  if (updateData.image && !updateData.images) {
    updateData.images = [updateData.image];
  }

  const updatedDestination = await Destination.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: updatedDestination,
    message: 'Destination updated successfully',
  });
});

// @desc    Delete destination (Admin only)
// @route   DELETE /api/destinations/:id
// @access  Private/Admin
const deleteDestination = asyncHandler(async (req, res) => {
  const destination = await Destination.findById(req.params.id);

  if (!destination) {
    res.status(404);
    throw new Error('Destination not found');
  }

  await Destination.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Destination deleted successfully',
  });
});

module.exports = {
  getDestinations,
  getDestinationBySlug,
  createDestination,
  updateDestination,
  deleteDestination,
};
