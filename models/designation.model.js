const mongoose = require('mongoose');
const slugify = require('slugify');

const designationSchema = new mongoose.Schema({
  designation_name: {
    type: String,
    required: true,
    trim: true
  },
  designation_slug: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  departmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: true
  },
  status: {
    type: Number,
    enum: [0, 1], // 0 = inactive, 1 = active
    default: 1
  }
}, { timestamps: true });


// Auto-generate slug before save
designationSchema.pre('validate', function(next) {
  if (this.designation_name && !this.designation_slug) {
    this.designation_slug = slugify(this.designation_name, { lower: true, strict: true });
  }
  next();
});

// Helper function to format doc
function formatDoc(doc) {
  if (!doc) return;
  doc = doc.toObject();

  // Convert status
  doc.status = doc.status === 1 ? 'Active' : 'Inactive';

  // Format timestamps (DD-MM-YYYY)
  if (doc.createdAt) {
    const d = new Date(doc.createdAt);
    doc.createdAt = `${d.getDate().toString().padStart(2, '0')}-${(d.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${d.getFullYear()}`;
  }
  if (doc.updatedAt) {
    const d = new Date(doc.updatedAt);
    doc.updatedAt = `${d.getDate().toString().padStart(2, '0')}-${(d.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${d.getFullYear()}`;
  }

  delete doc.__v;
  return doc;
}

// // Post middleware for find, findOne, save
// designationSchema.post('find', function (docs) {
//   for (let i = 0; i < docs.length; i++) {
//     docs[i] = formatDoc(docs[i]);
//   }
// });

// designationSchema.post('findOne', function (doc) {
//   return formatDoc(doc);
// });

module.exports = mongoose.model('Designation', designationSchema);
