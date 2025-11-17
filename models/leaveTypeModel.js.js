// LeaveType.js
const mongoose = require('mongoose');
const LeaveTypeSchema = new mongoose.Schema({
  name: { type: String, required: true },       // e.g., "Sick Leave", "Casual Leave", "Compensatory Off"
  description: { type: String },
  max_days_per_year: { type: Number }
});

module.exports = mongoose.model('LeaveType', LeaveTypeSchema);
