const mongoose = require('mongoose');
const Package = require('../models/Package');
const asyncHandler = require('../utils/asyncHandler');

// Helper to build unique slug
const generateUniqueSlug = (text) => {
  const base = text ? text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') : 'package';
  return `${base}-${Date.now().toString().slice(-4)}`;
};

// @desc    Get all packages with filtering, search, pagination
// @route   GET /api/packages
// @access  Public
const getPackages = asyncHandler(async (req, res) => {
  const {
    category,
    search,
    minPrice,
    maxPrice,
    featured,
    sort,
    page = 1,
    limit = 12,
  } = req.query;

  // Include active packages or packages where isActive is not explicitly false
  const query = { isActive: { $ne: false } };

  if (category && category !== 'All') {
    query.category = { $regex: `^${category.trim()}$`, $options: 'i' };
  }
  if (featured === 'true') {
    query.featured = true;
  }

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { destinationRoute: { $regex: search, $options: 'i' } },
      { category: { $regex: search, $options: 'i' } },
    ];
  }

  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  let sortOption = { createdAt: -1 };
  if (sort === 'price-low') sortOption = { price: 1 };
  if (sort === 'price-high') sortOption = { price: -1 };

  const count = await Package.countDocuments(query);
  const packages = await Package.find(query)
    .sort(sortOption)
    .skip((page - 1) * limit)
    .limit(Number(limit));

  res.status(200).json({
    success: true,
    data: {
      packages,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        totalPackages: count,
        totalPages: Math.ceil(count / limit),
      },
    },
  });
});

// @desc    Get single package by slug OR _id
// @route   GET /api/packages/:slug
// @access  Public
const getPackageBySlug = asyncHandler(async (req, res) => {
  const param = req.params.id;
  let query = { slug: param };

  if (mongoose.Types.ObjectId.isValid(param)) {
    query = { $or: [{ slug: param }, { _id: param }] };
  }

  const pkg = await Package.findOne(query);

  if (!pkg) {
    res.status(404);
    throw new Error('Package not found');
  }

  res.status(200).json({
    success: true,
    data: pkg,
  });
});

// @desc    Create package (Admin only)
// @route   POST /api/packages
// @access  Private/Admin
const createPackage = asyncHandler(async (req, res) => {
  const {
    title,
    category,
    durationDays,
    durationNights,
    duration,
    price,
    discountPrice,
    featured,
    overview,
    description,
    images,
    inclusions,
    exclusions,
    itinerary,
    destinationRoute,
  } = req.body;

  const pkgTitle = title || 'Tour Package';
  const pkgDescription = description || overview || 'Comprehensive tour experience offered by Dhanish Travel Co.';
  const days = Number(durationDays || (duration && duration.days) || 3);
  const nights = Number(durationNights || (duration && duration.nights) || Math.max(1, days - 1));
  const pkgPrice = Number(price || 9999);

  let validDiscountPrice = 0;
  if (discountPrice && Number(discountPrice) > 0 && Number(discountPrice) < pkgPrice) {
    validDiscountPrice = Number(discountPrice);
  }

  const slug = generateUniqueSlug(pkgTitle);

  const pkg = await Package.create({
    title: pkgTitle,
    slug,
    category: category || 'Domestic',
    description: pkgDescription,
    price: pkgPrice,
    discountPrice: validDiscountPrice,
    duration: {
      days,
      nights,
    },
    destinationRoute: destinationRoute || pkgTitle,
    featured: Boolean(featured),
    images: Array.isArray(images) && images.length > 0 ? images : ['https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=1000'],
    inclusions: inclusions || ['Hotels', 'Meals', 'Sightseeing'],
    exclusions: exclusions || ['Personal Expenses', 'Flights'],
    itinerary: itinerary || [{ day: 1, title: 'Arrival & Welcome', description: 'Check-in and leisure evening.' }],
    isActive: true,
  });

  res.status(201).json({
    success: true,
    data: pkg,
    message: 'Package created successfully',
  });
});

// @desc    Update package (Admin only)
// @route   PUT /api/packages/:id
// @access  Private/Admin
const updatePackage = asyncHandler(async (req, res) => {
  const pkg = await Package.findById(req.params.id);

  if (!pkg) {
    res.status(404);
    throw new Error('Package not found');
  }

  const updateData = { ...req.body };
  if (updateData.title && !updateData.slug) {
    updateData.slug = generateUniqueSlug(updateData.title);
  }
  if (!updateData.description && updateData.overview) {
    updateData.description = updateData.overview;
  }
  if (updateData.durationDays || updateData.durationNights) {
    updateData.duration = {
      days: Number(updateData.durationDays || pkg.duration?.days || 3),
      nights: Number(updateData.durationNights || pkg.duration?.nights || 2),
    };
  }
  updateData.isActive = true;

  const updatedPkg = await Package.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: updatedPkg,
    message: 'Package updated successfully',
  });
});

// @desc    Delete package (Admin only)
// @route   DELETE /api/packages/:id
// @access  Private/Admin
const deletePackage = asyncHandler(async (req, res) => {
  const pkg = await Package.findById(req.params.id);

  if (!pkg) {
    res.status(404);
    throw new Error('Package not found');
  }

  await Package.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Package deleted successfully',
  });
});

module.exports = {
  getPackages,
  getPackageBySlug,
  createPackage,
  updatePackage,
  deletePackage,
};
