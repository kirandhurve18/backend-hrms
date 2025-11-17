const EmployeeRecognition = require("../models/employeeRecognition");
const Employee = require("../models/employee.model");

// Get all recognition records
const getAllRecognition = async (req, res) => {
  try {
    const recognitions = await EmployeeRecognition.find({ is_active: true })
      .populate(
        "employee_id",
        "first_name last_name designation department company_email"
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: recognitions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching recognition records",
      error: error.message,
    });
  }
};

// Get all employees for dropdown
const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find({ is_active: true })
      .select("_id first_name last_name designation department company_email")
      .sort({ first_name: 1, last_name: 1 });

    // Format the response for dropdown
    const formattedEmployees = employees.map((employee) => ({
      _id: employee._id,
      full_name: `${employee.first_name} ${employee.last_name}`.trim(),
      designation: employee.designation,
      department: employee.department,
      company_email: employee.company_email,
    }));

    res.status(200).json({
      success: true,
      data: formattedEmployees,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching employees",
      error: error.message,
    });
  }
};

// Get award winners by year and award type
const getAwardWinnersByYear = async (req, res) => {
  try {
    const { year, award_type } = req.body;

    // Validate required parameters
    if (!year || !award_type) {
      return res.status(400).json({
        success: false,
        message: "Year and award_type are required parameters",
      });
    }

    const yearNum = parseInt(year);

    if (yearNum < 2000 || yearNum > 2100) {
      return res.status(400).json({
        success: false,
        message: "Year must be between 2000 and 2100",
      });
    }

    // Validate award type
    const validAwardTypes = [
      "Performer of the Month",
      "Leader of the Month",
      "Performer of the Quarter",
      "Leader of the Quarter",
      "Employee of the Year",
      "Leader of the Year",
    ];

    if (!validAwardTypes.includes(award_type)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid award type. Must be one of: " + validAwardTypes.join(", "),
      });
    }

    // Determine if it's a monthly, quarterly, or yearly award
    const isMonthlyAward = award_type.includes("Month");
    const isQuarterlyAward = award_type.includes("Quarter");
    const isYearlyAward = award_type.includes("Year");

    let query = {
      award_type: award_type,
      "period.year": yearNum,
      is_active: true,
    };

    // Fetch all recognitions for the given year and award type
    const recognitions = await EmployeeRecognition.find(query)
      .populate(
        "employee_id",
        "first_name last_name designation department company_email"
      )
      .sort({ "period.month": 1, "period.quarter": 1 });

    // Organize results by period
    let organizedResults = {};

    if (isMonthlyAward) {
      // Initialize all 12 months
      for (let month = 1; month <= 12; month++) {
        organizedResults[month] = {
          month: month,
          month_name: new Date(yearNum, month - 1, 1).toLocaleString(
            "default",
            { month: "long" }
          ),
          winners: [],
        };
      }

      // Populate winners for each month
      recognitions.forEach((recognition) => {
        if (recognition.period.month) {
          organizedResults[recognition.period.month].winners.push({
            employee: recognition.employee_id,
            description: recognition.description,
            awarded_pics: recognition.awarded_pics,
            created_at: recognition.createdAt,
          });
        }
      });
    } else if (isQuarterlyAward) {
      // Initialize all 4 quarters
      for (let quarter = 1; quarter <= 4; quarter++) {
        organizedResults[quarter] = {
          quarter: quarter,
          quarter_name: `Q${quarter}`,
          months:
            quarter === 1
              ? "Jan-Mar"
              : quarter === 2
              ? "Apr-Jun"
              : quarter === 3
              ? "Jul-Sep"
              : "Oct-Dec",
          winners: [],
        };
      }

      // Populate winners for each quarter
      recognitions.forEach((recognition) => {
        if (recognition.period.quarter) {
          organizedResults[recognition.period.quarter].winners.push({
            employee: recognition.employee_id,
            description: recognition.description,
            awarded_pics: recognition.awarded_pics,
            created_at: recognition.createdAt,
          });
        }
      });
    } else if (isYearlyAward) {
      // For yearly awards, just return the winners
      organizedResults = {
        year: yearNum,
        winners: recognitions.map((recognition) => ({
          employee: recognition.employee_id,
          description: recognition.description,
          awarded_pics: recognition.awarded_pics,
          created_at: recognition.createdAt,
        })),
      };
    }

    res.status(200).json({
      success: true,
      data: {
        year: yearNum,
        award_type: award_type,
        total_winners: recognitions.length,
        results: organizedResults,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching award winners",
      error: error.message,
    });
  }
};

// Add new recognized employee
const addRecognizedEmployee = async (req, res) => {
  try {
    const { employee_id, award_type, period, description, awarded_pics } =
      req.body;

    // Validate required fields
    if (!employee_id || !award_type || !period) {
      return res.status(400).json({
        success: false,
        message: "Employee ID, award type, and period (with year) are required",
      });
    }

    // Validate award type
    const validAwardTypes = [
      "Performer of the Month",
      "Leader of the Month",
      "Performer of the Quarter",
      "Leader of the Quarter",
      "Employee of the Year",
      "Leader of the Year",
    ];

    if (!validAwardTypes.includes(award_type)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid award type. Must be one of: " + validAwardTypes.join(", "),
      });
    }

    // Validate period structure
    if (period.month && (period.month < 1 || period.month > 12)) {
      return res.status(400).json({
        success: false,
        message: "Month must be between 1 and 12",
      });
    }

    if (period.quarter && (period.quarter < 1 || period.quarter > 4)) {
      return res.status(400).json({
        success: false,
        message: "Quarter must be between 1 and 4",
      });
    }

    if (period.year < 2000 || period.year > 2100) {
      return res.status(400).json({
        success: false,
        message: "Year must be between 2000 and 2100",
      });
    }

    // Check if employee already has this award for the same period
    let existingRecognition = await EmployeeRecognition.findOne({
      employee_id,
      award_type,
      "period.year": period.year,
      is_active: true,
    });

    if (period.month) {
      existingRecognition = await EmployeeRecognition.findOne({
        employee_id,
        award_type,
        "period.month": period.month,
        "period.year": period.year,
        is_active: true,
      });
    }

    if (period.quarter) {
      existingRecognition = await EmployeeRecognition.findOne({
        employee_id,
        award_type,
        "period.quarter": period.quarter,
        "period.year": period.year,
        is_active: true,
      });
    }

    if (existingRecognition) {
      return res.status(409).json({
        success: false,
        message: "Employee already has this award for the specified period",
      });
    }

    // Create new recognition record
    const newRecognition = new EmployeeRecognition({
      employee_id,
      award_type,
      period,
      description: description || "",
      awarded_pics: awarded_pics || [],
      is_active: true,
    });

    const savedRecognition = await newRecognition.save();

    // Populate employee details for response
    await savedRecognition.populate(
      "employee_id",
      "first_name last_name designation department company_email"
    );

    res.status(200).json({
      success: true,
      message: "Employee recognition added successfully",
      data: savedRecognition,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error adding employee recognition",
      error: error.message,
    });
  }
};

module.exports = {
  getAllRecognition,
  getAllEmployees,
  getAwardWinnersByYear,
  addRecognizedEmployee,
};
