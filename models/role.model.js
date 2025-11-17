const mongoose = require("mongoose");
const slugify = require('slugify');

// const PermissionSchema = new mongoose.Schema({
//   module: { type: String, required: true },
//   actions: [{ type: String, enum: ["read", "write", "create", "delete"] }]
// }, { _id: false });

const RoleSchema = new mongoose.Schema(
  {
    role_name: { type: String, required: true, trim: true },
    role_slug: { type: String, required: true, trim: true, unique: true },
    description: { type: String, trim: true },
    // department_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
    // permissions: {
    //   type: Map,
    //   of: {
    //     type: [String],
    //     enum: ["read", "write", "create", "delete"]
    //   }
    // },
    permissions: [
      {
        _id: false, // 👈 disable subdocument _id
        menu: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Menu",
          required: true,
        },
        actions: [
          {
            type: String,
            enum: ["read", "write", "create", "delete"],
            required: true,
          },
        ],
      },
    ],
    is_active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Auto-generate slug before save
RoleSchema.pre('validate', function(next) {
  if (this.role_name && !this.role_slug) {
    this.role_slug = slugify(this.role_name, { lower: true, strict: true });
  }
  next();
});


module.exports = mongoose.model("Role", RoleSchema);
