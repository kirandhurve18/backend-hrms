const mongoose = require('mongoose');

const incomeComponentsSchema = new mongoose.Schema({
  component: {
    type: String,
    trim: true
  },
  status: {
    type: Number,
    enum: [0, 1], // 0 = inactive, 1 = active
    default: 1
  }
}, { timestamps: true });

module.exports = mongoose.model('incomeComponents', incomeComponentsSchema);
