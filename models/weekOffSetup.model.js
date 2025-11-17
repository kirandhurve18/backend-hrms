const mongoose = require('mongoose');

const weekOffSetupSchema = new mongoose.Schema({
  work_mode: {
    type: String,
    trim: true
  },
  days: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model('weekOffSetup', weekOffSetupSchema);
