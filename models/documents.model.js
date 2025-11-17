const mongoose = require("mongoose");

// models/EmployeeDocuments.js
const allowedDocTypes = [
  "aadhar_card",
  "pan_card",
  "passport_photo",
  "employee_sign",
  "tenth_certificate",
  "twelfth_certificate",
  "graduation_certificate",
  "resume",
  "experience_letter",
  "relieving_letter",
  "previous_offer_letter",
  "form_16",
  "salary_slips",
  "previous_pay_slips",
];

const EmployeeDocumentsSchema = new mongoose.Schema(
  {
    employee_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    // employee_id: {
    //   // type: mongoose.Schema.Types.ObjectId,
    //   // ref: 'Employee',
    //   type: String,
    //   required: true,
    //   trim: true,
    // },
    document_type: {
      type: String,
      required: true,
      // enum: [
      //   'aadhar_card',
      //   'pan_card',
      //   'passport_photo',
      //   'employee_sign',
      //   'tenth_certificate',
      //   'twelfth_certificate',
      //   'graduation_certificate',
      //   'resume',
      //   'experience_letter',
      //   'relieving_letter',
      //   'previous_offer_letter',
      //   'form_16',
      //   'salary_slips'
      // ]
      enum: allowedDocTypes,
    },
    // files: {
    //   type: [String], // Array of file paths (PDFs, images, etc.)
    //   required: true
    // },
    status: {
      type: Number,
      enum: [1, 0], // [1 = 'active, 0 = 'inactive'],
      default: 1,
    },
    // uploaded_at: {
    //   type: Date,
    //   default: Date.now
    // }
    files: [
      {
        path: { type: String, required: true }, // file path / S3 URL
        status: {
          type: Number,
          enum: [1, 0],
          default: 1,
        },
        uploaded_at: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

// module.exports = mongoose.model("EmployeeDocuments", EmployeeDocumentsSchema);

module.exports = {
  EmployeeDocuments: mongoose.model('EmployeeDocuments', EmployeeDocumentsSchema),
  allowedDocTypes
};