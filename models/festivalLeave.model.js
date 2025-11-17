const mongoose = require('mongoose');

const festivalLeaveSchema = new mongoose.Schema({
  festival: {
    type: String,
    required: true,
    trim: true
  },
  festival_date: {
    type: Date,
    required: true
  },
  festival_day: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true 
});

module.exports = mongoose.model('FestivalLeave', festivalLeaveSchema);
