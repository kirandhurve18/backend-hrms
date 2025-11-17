const mongoose = require('mongoose');

const shiftTimingsSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true
  },
  timings: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model('shiftTimings', shiftTimingsSchema);
