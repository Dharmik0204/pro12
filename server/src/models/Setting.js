const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      default: 'Dhanish Travel Co.',
    },
    tagline: {
      type: String,
      default: 'Your Smart Travel Partner',
    },
    siteLogo: {
      type: String,
      default: '',
    },
    heroBanner: {
      type: String,
      default: '',
    },
    phone: {
      type: String,
      default: '+91 84848 59316',
    },
    email: {
      type: String,
      default: 'info@dhanisotravel.com',
    },
    address: {
      type: String,
      default: 'Gurukrupa Apt, Hirawadi road, Panchvati, Nashik (MH)-422003',
    },
    socialLinks: {
      facebook: { type: String, default: 'https://facebook.com' },
      instagram: { type: String, default: 'https://instagram.com' },
      twitter: { type: String, default: 'https://twitter.com' },
      whatsapp: { type: String, default: '+918484859316' },
      youtube: { type: String, default: 'https://youtube.com' },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Setting', settingSchema);
