const mongoose = require('mongoose');

const leaveAndServiceSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true
  },
  duration: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model('LeaveAndService', leaveAndServiceSchema);
