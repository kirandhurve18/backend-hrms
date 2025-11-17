const mongoose = require('mongoose');

const backgroundVerificationSchema = new mongoose.Schema({
  designation: { type: String, enum: ['hr', 'lead', 'manager', 'company'], required: true, unique: true },
  name: { type: String, },
  email: { type: String, },
  number: { type: Number, }
}, { _id: false }); // _id: false prevents auto _id for each sub-doc


const EmployeeSchema = new mongoose.Schema({
  employee_id: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  role_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role',
    required: true
  },
  team_lead_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee'
  },
  team_managers_id: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee'
    },
  ],
  first_name: { type: String, required: true },
  middle_name: { type: String },
  last_name: { type: String, required: true },

  company_email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true  // encrypted password
  },
  pwd: {
    type: String  // plain password 
  },
  personal_email: {
    type: String,
    lowercase: true,
    trim: true
  },
  department_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department"
  },
  designation_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Designation"
  },
  sub_designation_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "subDesignation"
  },
  employment_type: { type: String, enum: ['FULLTIME', 'CONTRACT', 'INTERNSHIP'] },
  employee_number: { type: String },
  alternate_number: { type: String },
  emergency_number: { type: String },
  family_member_relation: {type: String },
  current_address: { type: String },
  // is_current_add_same_as_permanent: {type: Boolean},
  permanent_address: { type: String },
  probation_period_ends_on: { type: String},
  date_of_birth: { type: Date },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other']
  },
  blood_group: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']
  },
  work_mode: { type: String, enum: ['WFH', 'WFO', 'HYBRID'], default: 'WFO' },
  rw_agreement_accepted: { type: Boolean, default: false },
  date_of_joining: { type: Date, required: true },
  internship_ends_on: {type: String},
  notice_period: { type: Number },
  last_working_day: { type: String },
  work_experience: { type: Number },
  salary: { type: Number },

  bank_account_number: { type: String },
  bank_name: { type: String },
  ifsc_code: { type: String },

  is_active: {
    type: Boolean,
    default: true
  },
  comp_off: {
    type: Number,
    default: 0
  },
  company_policy_accept: {
    type: Boolean,
    default: false
  },

  // Education
  tenth_passing_year: { type: Number },
  tenth_percentage: { type: Number },
  twelfth_passing_year: { type: Number },
  twelfth_percentage: { type: Number },
  graduation_passing_year: { type: Number },
  graduation_percentage: { type: Number },
  post_graduation_passing_year: { type: Number },
  post_graduation_percentage: { type: Number },

  // Documents 
  aadhar_card: { type: String },
  aadhar_card_number: { type: String },
  pan_card: { type: String },
  pan_card_number: { type: String },
  passport_photo: { type: String },
  employee_sign: { type: String },
  tenth_certificate: { type: String },
  twelfth_certificate: { type: String },
  graduation_certificate: { type: String },
  resume: { type: String },
  // previous_employeement_document: [{
  //     type: String
  //   }]
  previous_pay_slips: [{ type: String }],
  previous_offer_letter: { type: String },
  previous_experience_letter: { type: String },
  form16: { type: String },
  pf_account_number: {type:String},
  uan_number: { type: String },
  esi_number: { type: String },
  assigned_menus: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Menu'
  }],
  background_verification: [backgroundVerificationSchema],

}, { timestamps: true }); 

module.exports = mongoose.model('Employee', EmployeeSchema);
