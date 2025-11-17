const mongoose = require('mongoose');
const slugify = require('slugify');

const subdesignationSchema = new mongoose.Schema({
  sub_designation_name: {
    type: String,
    required: true,
    trim: true
  },
  sub_designation_slug: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
//   designationId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Designation',
//     required: true
//   },
//   departmentId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Department',
//     required: true
//   },
  status: {
    type: Number,
    enum: [0, 1], // 0 = inactive, 1 = active
    default: 1
  }
}, { timestamps: true });


// Auto-generate slug before save
subdesignationSchema.pre('validate', function(next) {
  if (this.sub_designation_name && !this.sub_designation_slug) {
    this.sub_designation_slug = slugify(this.sub_designation_name, { lower: true, strict: true });
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
// subdesignationSchema.post('find', function (docs) {
//   for (let i = 0; i < docs.length; i++) {
//     docs[i] = formatDoc(docs[i]);
//   }
// });

// subdesignationSchema.post('findOne', function (doc) {
//   return formatDoc(doc);
// });


module.exports = mongoose.model('subDesignation', subdesignationSchema);
