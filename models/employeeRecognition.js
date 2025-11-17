const mongoose = require('mongoose');

const EmployeeRecognitionSchema = new mongoose.Schema({
  employee_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  award_type: {
    type: String,
    enum: [
      'Performer of the Month',
      'Leader of the Month',
      'Performer of the Quarter',
      'Leader of the Quarter',
      'Employee of the Year',
      'Leader of the Year'
    ],
    required: true
  },
  period: {
    month: { type: Number, min: 1, max: 12 },     // Optional: 1 - 12
    quarter: { type: Number, min: 1, max: 4 },    // Optional: 1 - 4
    year: { type: Number, required: true }        // Required for all eg. 2025, 2026
  },
  description: {
    type: String   // Optional remarks 
  },
  awarded_pics: [{
    type: String  // awards pics
  }],
  is_active: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('EmployeeRecognition', EmployeeRecognitionSchema);
