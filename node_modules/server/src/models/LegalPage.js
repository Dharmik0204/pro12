const mongoose = require('mongoose');

const legalPageSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      unique: true,
      enum: ['privacy', 'terms', 'cancellation'],
    },
    sections: [
      {
        heading: { type: String, required: true },
        body: { type: String, required: true },
      },
    ],
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('LegalPage', legalPageSchema);
