const LegalPage = require('../models/LegalPage');
const asyncHandler = require('../utils/asyncHandler');

// Helper to get default legal page contents
const getDefaultLegalContent = (type) => {
  const defaults = {
    privacy: {
      type: 'privacy',
      sections: [
        {
          heading: 'Introduction',
          body: 'Welcome to Dhanish Travel Co. (WanderVista). We value your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, and safeguard your information when you visit our website.',
        },
        {
          heading: 'Data We Collect',
          body: 'We collect personal information that you provide to us, including your name, email address, phone number, and payment information during bookings or contact queries.',
        },
        {
          heading: 'Cookies & Tracking',
          body: 'We use cookies to analyze web traffic, remember user login states, and provide a seamless navigation experience across pages.',
        },
      ],
    },
    terms: {
      type: 'terms',
      sections: [
        {
          heading: 'Terms of Use',
          body: 'By accessing or using our travel platform, you agree to comply with and be bound by these terms and conditions. If you do not agree, please do not use our services.',
        },
        {
          heading: 'Booking Conditions',
          body: 'All bookings made through WanderVista are subject to availability and confirmation. Pricing listed on our website is subject to change without prior notice.',
        },
        {
          heading: 'Liability Disclaimer',
          body: 'Dhanish Travel Co. acts as an agent for hotels, airlines, and local tour operators. We are not liable for any injuries, delays, or losses caused by third-party services.',
        },
      ],
    },
    cancellation: {
      type: 'cancellation',
      sections: [
        {
          heading: 'Cancellation Policy',
          body: 'Cancellations must be requested via our portal or contact email. Refunds will be processed based on the timeframe in which the cancellation request is received prior to the tour start date.',
        },
        {
          heading: 'Refund Guidelines',
          body: '- 30 days or more before departure: 100% refund minus booking fees.<br/>- 15 to 29 days before departure: 50% refund.<br/>- Less than 15 days before departure: No refund.',
        },
        {
          heading: 'Force Majeure',
          body: 'In case of natural disasters, government restrictions, or pandemics, bookings may be rescheduled or refunded subject to airlines and hotel partner guidelines.',
        },
      ],
    },
  };
  return defaults[type];
};

// @desc    Get legal page content by type
// @route   GET /api/legal/:type
// @access  Public
const getLegalPage = asyncHandler(async (req, res) => {
  const { type } = req.params;

  if (!['privacy', 'terms', 'cancellation'].includes(type)) {
    res.status(400);
    throw new Error('Invalid legal page type');
  }

  let page = await LegalPage.findOne({ type });

  // If page doesn't exist, create it with default values automatically
  if (!page) {
    const defaultData = getDefaultLegalContent(type);
    page = await LegalPage.create(defaultData);
  }

  res.status(200).json({
    success: true,
    data: page,
  });
});

// @desc    Update legal page content (admin only)
// @route   PUT /api/legal/:type
// @access  Private/Admin
const updateLegalPage = asyncHandler(async (req, res) => {
  const { type } = req.params;
  const { sections } = req.body;

  if (!['privacy', 'terms', 'cancellation'].includes(type)) {
    res.status(400);
    throw new Error('Invalid legal page type');
  }

  if (!sections || !Array.isArray(sections)) {
    res.status(400);
    throw new Error('Sections array is required');
  }

  let page = await LegalPage.findOne({ type });

  if (page) {
    page.sections = sections;
    page.lastUpdated = Date.now();
    await page.save();
  } else {
    page = await LegalPage.create({
      type,
      sections,
      lastUpdated: Date.now(),
    });
  }

  res.status(200).json({
    success: true,
    data: page,
    message: 'Legal page updated successfully',
  });
});

module.exports = {
  getLegalPage,
  updateLegalPage,
};
