const mongoose = require('mongoose');

const LeaveApplicationSchema = new mongoose.Schema({
  employee_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  leave_type_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LeaveType',
    required: true
  },

  // Continuous leave range, Half day leave, Full Day Leave
  from_date: { type: Date },
  to_date: { type: Date },

  // OR Non-continuous custom dates
  custom_dates: [{
    type: Date   //eg. 2025-07-01, 2025-07-02
  }],

  leave_mode: {
    type: String,
    enum: ['Full Day', 'Half Day', 'Continuous', 'Custom Dates'],
    required: true
  },

  reason: { type: String, required: true },
  document: { type: String },

  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected', 'Cancelled'],
    default: 'Pending'
  },
  approved_by_manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee'
  },
  approved_by_hr: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee'
  },
  approved_by_head: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee'
  },
  rejection_reason: { type: String },

  number_of_days: {
    type: Number, // Auto-calculated after excluding holidays/weekends
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('LeaveApplication', LeaveApplicationSchema);
