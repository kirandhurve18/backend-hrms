const LeaveApplication = require("../models/leaveApplicationModel.js");
const LeaveType = require("../models/leaveTypeModel.js");
const Employee = require("../models/employee.model");

const applyLeave = async (req, res) => {
  try {
    const {
      employee_id, // ObjectId of employee
      leave_type_id, // ObjectId of leave type
      leave_mode, // 'Full Day' or 'Half Day'
      from_date, // Start date (string or Date)
      to_date, // End date (string or Date)
      number_of_days, // Number of days (number)
      reason, // Reason (string)
      document, // Optional: document (string)
      manager_comments, // Optional: manager comments (string)
      hr_comments, // Optional: HR comments (string)
      head_comments, // Optional: Head comments (string)
    } = req.body;

    // Basic validation
    if (
      !employee_id ||
      !leave_type_id ||
      !leave_mode ||
      !from_date ||
      !to_date ||
      !number_of_days ||
      !reason
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided.",
      });
    }

    // Optionally: Validate employee and leave type exist
    // const employee = await Employee.findById(employee_id);
    // if (!employee) return res.status(404).json({ success: false, message: "Employee not found." });

    // const leaveType = await LeaveType.findById(leave_type_id);
    // if (!leaveType) return res.status(404).json({ success: false, message: "Leave type not found." });

    // Create leave application
    const leaveApplication = new LeaveApplication({
      employee_id,
      leave_type_id,
      leave_mode,
      from_date: new Date(from_date),
      to_date: new Date(to_date),
      reason,
      number_of_days,
      document,
      status: "Pending",
      manager_comments,
      hr_comments,
      head_comments,
    });

    await leaveApplication.save();

    res.status(200).json({
      success: true,
      message: "Leave application submitted successfully.",
      data: leaveApplication,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error applying for leave.",
      error: error.message,
    });
  }
};

//return leaves listing of employees which are applied,

const getAllLeaves = async (req, res) => {
  const { status, employee_name } = req.body;

  if (!status) {
    return res.status(400).json({
      success: false,
      message: "Status is required to filter leave applications.",
    });
  }
  try {
    // Build the base query
    let query = { status: status };

    // If employee_name is provided, find matching employee IDs
    let employeeIds = [];
    if (employee_name && employee_name.trim() !== "") {
      const regex = new RegExp(employee_name, "i"); // case-insensitive search
      const employees = await Employee.find({
        $or: [{ first_name: regex }, { last_name: regex }],
      }).select("_id");
      employeeIds = employees.map((emp) => emp._id);

      if (employeeIds.length === 0) {
        return res.status(200).json({
          success: true,
          message: "No employees found with the given name.",
          data: [],
        });
      }
      query.employee_id = { $in: employeeIds };
    }

    const leaves = await LeaveApplication.find(query)
      .populate("employee_id")
      .populate("leave_type_id");

    res.status(200).json({
      success: true,
      message: "Leave applications fetched successfully.",
      data: leaves,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching leave applications.",
      error: error.message,
    });
  }
};

//search leaves by employee name

module.exports = { applyLeave, getAllLeaves };
