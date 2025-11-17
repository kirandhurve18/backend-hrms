const mongoose = require("mongoose");
const moment = require("moment-timezone");

const TimesheetSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    workLogs: [
      {
        hourSlot: {
          type: String, // e.g., "09:30-10:30"
          required: true,
        },
        task: {
          type: String,
          required: true,
          trim: true,
        },
      },
    ],
    submitStatus: {
      type: Number,
      enum: [0, 1, 2, 3, 4, 5],
      default: 0, //eg.1=Save,2=Final Submited,3=Approved,4=Rejected,5=reassign
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    },
    rejectedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    },
    rejectedReason: {
      type: String,
      trim: true,
    },
    submittedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

TimesheetSchema.index({ employee: 1, date: 1 }, { unique: true });

TimesheetSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    // format work date
    if (ret.date) {
      ret.date = moment(ret.date).tz("Asia/Kolkata").format("YYYY-MM-DD");
    }

    // format timestamps
    if (ret.createdAt) {
      ret.createdAt = moment(ret.createdAt).tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");
    }
    if (ret.updatedAt) {
      ret.updatedAt = moment(ret.updatedAt).tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");
    }
    if (ret.submittedAt) {
      ret.submittedAt = moment(ret.submittedAt).tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");
    }

    return ret;
  }
});

TimesheetSchema.set("toObject", {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
     if (ret.date) {
      ret.date = moment(ret.date).tz("Asia/Kolkata").format("YYYY-MM-DD");
    }
    if (ret.createdAt) {
      ret.createdAt = moment(ret.createdAt).tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");
    }
    if (ret.updatedAt) {
      ret.updatedAt = moment(ret.updatedAt).tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");
    }
    if (ret.submittedAt) {
      ret.submittedAt = moment(ret.submittedAt).tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");
    }
    return ret;
  }
});

module.exports = mongoose.model("Timesheet", TimesheetSchema);
