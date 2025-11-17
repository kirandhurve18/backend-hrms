const mongoose = require('mongoose');

const MenuSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true  // e.g., 'Assign Employee List', 'Employee Wise Work Report', 'Employee', 'Manage Designation', 'Manage Department'
  },
  key: {
    type: String,
    required: true,
    unique: true  // e.g., 'assign_employee_list', 'employee_wise_work_report', 'employee', 'designation', 'department'
  },
  icon: {
    type: String  // for frontend icons (optional)
  },
  order: {
    type: Number,
    default: 0
  },
  is_active: {
    type: Boolean,
    default: true
  },
  // employee_id: {
  //   type: String  
  // },
  // category: {
  //   type: String,
  //   enum: ["ALL","EMPLOYEE"]
  // }
}, { timestamps: true });

module.exports = mongoose.model('Menu', MenuSchema);
