const mongoose = require('mongoose');

const itineraryDaySchema = new mongoose.Schema({
  day: { type: Number, default: 1 },
  title: { type: String, default: 'Day Activities' },
  description: { type: String, default: 'Sightseeing & leisure' },
  overnightAt: { type: String, default: '' },
});

const packageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Package title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    category: {
      type: String,
      default: 'Domestic',
      trim: true,
    },
    description: {
      type: String,
      default: 'Comprehensive tour package experience offered by Dhanish Travel Co.',
    },
    images: {
      type: [String],
      default: ['https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=1000'],
    },
    duration: {
      days: { type: Number, default: 3 },
      nights: { type: Number, default: 2 },
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be positive'],
    },
    discountPrice: {
      type: Number,
      default: 0,
    },
    destinationRoute: {
      type: String,
      default: 'India',
    },
    rating: {
      type: Number,
      default: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    highlights: {
      type: [String],
      default: [],
    },
    inclusions: {
      type: [String],
      default: [],
    },
    exclusions: {
      type: [String],
      default: [],
    },
    itinerary: {
      type: [itineraryDaySchema],
      default: [],
    },
    hotels: {
      type: [String],
      default: [],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Package', packageSchema);
