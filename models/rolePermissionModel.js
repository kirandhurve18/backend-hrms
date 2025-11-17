const mongoose = require('mongoose');

const RolePermissionSchema = new mongoose.Schema({
  employee_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  menu_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Menu',
    required: true
  },
  permissions: {
    read: { type: Boolean, default: false },
    write: { type: Boolean, default: false },
    update: { type: Boolean, default: false },
    delete: { type: Boolean, default: false }
  }
}, { timestamps: true });

module.exports = mongoose.model('RolePermission', RolePermissionSchema);
