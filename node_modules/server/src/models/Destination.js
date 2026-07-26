const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Destination name is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
      trim: true,
    },
    state: {
      type: String,
      default: '',
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    images: {
      type: [String],
      default: [],
    },
    bestTimeToVisit: {
      type: String,
      default: '',
    },
    duration: {
      type: String,
      default: '',
    },
    height: {
      type: String,
      default: '',
    },
    topAttractions: {
      type: [String],
      default: [],
    },
    thingsToDo: {
      type: [String],
      default: [],
    },
    sampleItinerary: {
      type: [
        {
          day: { type: Number, required: true },
          activities: { type: [String], required: true },
        },
      ],
      default: [],
    },
    nearbyAttractions: {
      type: [String],
      default: [],
    },
    travelTips: {
      type: [String],
      default: [],
    },
    linkedPackages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Package',
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Destination', destinationSchema);
