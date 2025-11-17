const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  employee_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  checkin_date: {
    type: Date,
    required: true
  },
  checkin_time: {
    type: String
  },
  checkout_date: {
    type: Date
  },
  checkout_time: {
    type: String
  },
  checkin_location: {
    type: String
  },
  checkout_location: {
    type: String
  },
  latitude: {
    type: String  
  },
  longitude: {
    type: String
  },
  status: {
    type: Number,
    enum: [1, 2, 3, 4, 5, 6, 7], // 1=full day, 2=half day, 3=early leave, 4=late join, 5-comp off,6-electricity issue,7=late mark
    default: 1,
    required: true,
  },
  comment: {
    type: String
  }
}, { timestamps: true });

// Helper function to format doc
function formatDoc(doc) {
  if (!doc) return;
  doc = doc.toObject();

  const formatDate = (date) => {
    const d = new Date(date);
    return `${d.getFullYear()}-${(d.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
  };

  if (doc.createdAt) {
    doc.createdAt = formatDate(doc.createdAt);
  }
  if (doc.updatedAt) {
    doc.updatedAt = formatDate(doc.updatedAt);
  }
  if (doc.checkin_date) {
    doc.checkin_date = formatDate(doc.checkin_date);
  }
  if (doc.checkout_date) {
    doc.checkout_date = formatDate(doc.checkout_date);
  }

  delete doc.__v;
  return doc;
}

// Post middleware for find, findOne, save
// AttendanceSchema.post('find', function (docs) {
//   for (let i = 0; i < docs.length; i++) {
//     docs[i] = formatDoc(docs[i]);
//   }
// });

// AttendanceSchema.post('findOne', function (doc) {
//   return formatDoc(doc);
// });

module.exports = mongoose.model('Attendance', AttendanceSchema);
