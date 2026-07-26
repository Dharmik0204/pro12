const mongoose = require('mongoose');

const travelerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, enum: ['male', 'female', 'other'], required: true },
  isLead: { type: Boolean, default: false },
  idProof: { type: String, default: '' },
});

const addonSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
});

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    package: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Package',
      required: true,
    },
    travelDate: {
      start: { type: Date, required: true },
      end: { type: Date, required: true },
    },
    travelers: {
      type: [travelerSchema],
      required: true,
      validate: {
        validator: function (val) {
          return val && val.length > 0;
        },
        message: 'At least one traveler is required',
      },
    },
    addons: {
      type: [addonSchema],
      default: [],
    },
    packageCost: {
      type: Number,
      required: true,
    },
    addonCost: {
      type: Number,
      default: 0,
    },
    extraTravelerCost: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded', 'cancelled'],
      default: 'pending',
    },
    paymentId: {
      type: String,
      default: '',
    },
    bookingStatus: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending',
    },
    bookingRef: {
      type: String,
      unique: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save to auto-generate unique booking reference if not present
bookingSchema.pre('save', function (next) {
  if (!this.bookingRef) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = 'DTC-';
    for (let i = 0; i < 8; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    this.bookingRef = code;
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);
