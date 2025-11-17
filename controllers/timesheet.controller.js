const timesheetModel = require("../models/timesheet.model");
const moment = require("moment-timezone");
const employeeModel = require("../models/employee.model");
const { default: mongoose } = require("mongoose");

const addWorkReport = async (req, res) => {
  try {
    const { employee, date, workLogs, submitStatus } = req.body;

    if (
      !employee ||
      !date ||
      !Array.isArray(workLogs) ||
      workLogs.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Employee, date, and workLogs are required",
      });
    }

    // Convert incoming date (or default to today)
    const reportDateStr = moment
      .tz(date || new Date(), "Asia/Kolkata")
      .format("YYYY-MM-DD");

    // Convert back to JS Date object (time 00:00:00) for Mongo
    const reportDate = moment.tz(reportDateStr, "Asia/Kolkata").toDate();

    // Upsert timesheet (create if not exists, update if exists)
    const timesheet = await timesheetModel.findOneAndUpdate(
      { employee, date: reportDate },
      {
        $set: {
          workLogs,
          submitStatus: submitStatus || 1, // default to "Saved"
          submittedAt: submitStatus === 2 ? new Date() : undefined,
        },
      },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Work report added/updated successfully",
      // data: timesheet,
    });
  } catch (e) {
    console.error("Error in addWorkReport:", e);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: e.message,
    });
  }
};

const getWorkReport = async (req, res) => {
  try {
    let { employee, date } = req.body;

    if (!employee) {
      return res.status(400).json({
        success: false,
        message: "Please provide employee.",
      });
    }

    // 📅 Date range setup
    let start, end;
    if (date) {
      start = moment.tz(date, "Asia/Kolkata").startOf("day").toDate();
      end = moment.tz(date, "Asia/Kolkata").endOf("day").toDate();
    } else {
      start = moment().tz("Asia/Kolkata").startOf("day").toDate();
      end = moment().tz("Asia/Kolkata").endOf("day").toDate();
    }

    const pipeline = [
      {
        $match: {
          employee: new mongoose.Types.ObjectId(employee),
          date: { $gte: start, $lte: end },
        },
      },
      {
        $lookup: {
          from: "employees",
          localField: "employee",
          foreignField: "_id",
          as: "employee",
        },
      },
      { $unwind: "$employee" },
      {
        $lookup: {
          from: "employees",
          localField: "approvedBy",
          foreignField: "_id",
          as: "approvedBy",
        },
      },
      { $unwind: { path: "$approvedBy", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "employees",
          localField: "rejectedBy",
          foreignField: "_id",
          as: "rejectedBy",
        },
      },
      { $unwind: { path: "$rejectedBy", preserveNullAndEmptyArrays: true } },
      // 👇 merge with attendance
      {
        $lookup: {
          from: "attendances",
          let: { empId: "$employee._id", tsDate: "$date" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$employee_id", "$$empId"] },
                    { $eq: ["$checkin_date", "$$tsDate"] },
                  ],
                },
              },
            },
            {
              $project: {
                _id: 0,
                checkin_time: 1,
                checkout_time: 1,
              },
            },
          ],
          as: "attendance",
        },
      },
      { $unwind: { path: "$attendance", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          date: {
            $cond: [
              { $ifNull: ["$date", false] },
              {
                $dateToString: {
                  format: "%Y-%m-%d",
                  date: "$date",
                  timezone: "Asia/Kolkata",
                },
              },
              null,
            ],
          },
          submitStatus: 1,
          rejectedReason: 1,
          submittedAt: {
            $cond: [
              { $ifNull: ["$submittedAt", false] },
              {
                $dateToString: {
                  format: "%Y-%m-%d %H:%M:%S",
                  date: "$submittedAt",
                  timezone: "Asia/Kolkata",
                },
              },
              null,
            ],
          },

          employee_id: "$employee._id",
          full_name: {
            $concat: ["$employee.first_name", " ", "$employee.last_name"],
          },
          approvedBy: {
            $cond: [
              { $ifNull: ["$approvedBy", false] },
              {
                $concat: [
                  "$approvedBy.first_name",
                  " ",
                  "$approvedBy.last_name",
                ],
              },
              null,
            ],
          },
          rejectedBy: {
            $cond: [
              { $ifNull: ["$rejectedBy", false] },
              {
                $concat: [
                  "$rejectedBy.first_name",
                  " ",
                  "$rejectedBy.last_name",
                ],
              },
              null,
            ],
          },
          attendance: 1,
          workLogs: 1,
        },
      },
      { $sort: { date: 1 } },
    ];

    const reports = await timesheetModel.aggregate(pipeline);

    if (!reports || reports.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No work report found for the given date range.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Work report fetched successfully",
      data: reports,
    });
  } catch (e) {
    console.error("Error in getWorkReport:", e);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: e.message,
    });
  }
};

const getTimesheetStatusByEmployee = async (req, res) => {
  try {
    let {
      employee_id,
      fromDate,
      toDate,
      page = 1,
      limit = 10,
      search = "",
      sortBy = "date",
      order = "asc",
    } = req.body;

    if (!employee_id || !fromDate || !toDate) {
      return res.status(400).json({
        success: false,
        message: "Please provide employee_id, fromDate, and toDate.",
      });
    }

    page = parseInt(page);
    limit = parseInt(limit);
    const skip = (page - 1) * limit;

    // normalize dates to IST
    const start = moment.tz(fromDate, "Asia/Kolkata").startOf("day").toDate();
    const end = moment.tz(toDate, "Asia/Kolkata").endOf("day").toDate();

    // sort config
    const sortObj = {};
    sortObj[sortBy] = order.toLowerCase() === "desc" ? -1 : 1;

    const baseMatch = {
      employee: new mongoose.Types.ObjectId(employee_id),
      date: { $gte: start, $lte: end },
    };

    // Build aggregation
    const pipeline = [
      { $match: baseMatch },
      // join employee
      {
        $lookup: {
          from: "employees",
          localField: "employee",
          foreignField: "_id",
          as: "employee",
        },
      },
      { $unwind: "$employee" },
      // join approver
      {
        $lookup: {
          from: "employees",
          localField: "approvedBy",
          foreignField: "_id",
          as: "approvedBy",
        },
      },
      { $unwind: { path: "$approvedBy", preserveNullAndEmptyArrays: true } },
      // join rejector
      {
        $lookup: {
          from: "employees",
          localField: "rejectedBy",
          foreignField: "_id",
          as: "rejectedBy",
        },
      },
      { $unwind: { path: "$rejectedBy", preserveNullAndEmptyArrays: true } },
    ];

    // Apply search filter
    // if (search) {
    //   pipeline.push({
    //     $match: {
    //       $or: [
    //         { "employee.first_name": { $regex: search, $options: "i" } },
    //         { "employee.last_name": { $regex: search, $options: "i" } },
    //       ],
    //     },
    //   });
    // }

    // Projection
    pipeline.push({
      $project: {
        _id: 1,
        submitStatus: 1,
        rejectedReason: 1,
        date: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$date",
            timezone: "Asia/Kolkata",
          },
        },
        submittedAt: {
          $cond: [
            { $ifNull: ["$submittedAt", false] },
            {
              $dateToString: {
                format: "%Y-%m-%d %H:%M:%S",
                date: "$submittedAt",
                timezone: "Asia/Kolkata",
              },
            },
            null,
          ],
        },
        submittedDay: {
          $cond: [
            { $ifNull: ["$submittedAt", false] },
            {
              $dateToString: {
                format: "%w", // 👈 sorts day name (e.g., )
                date: "$submittedAt",
                timezone: "Asia/Kolkata",
              },
            },
            null,
          ],
        },
        // "employee._id": 1,
        full_name: {
          $concat: ["$employee.first_name", " ", "$employee.last_name"],
        },
        approvedBy: {
          $cond: [
            { $ifNull: ["$approvedBy", false] },
            {
              $concat: ["$approvedBy.first_name", " ", "$approvedBy.last_name"],
            },
            null,
          ],
        },
        rejectedBy: {
          $cond: [
            { $ifNull: ["$rejectedBy", false] },
            {
              $concat: ["$rejectedBy.first_name", " ", "$rejectedBy.last_name"],
            },
            null,
          ],
        },
      },
    });

    // Count & Paginate
    const countPipeline = [...pipeline, { $count: "totalRecords" }];
    const [countResult, timesheets] = await Promise.all([
      timesheetModel.aggregate(countPipeline),
      timesheetModel.aggregate([
        ...pipeline,
        { $sort: sortObj },
        { $skip: skip },
        { $limit: limit },
      ]),
    ]);

    const totalRecords =
      countResult.length > 0 ? countResult[0].totalRecords : 0;

    res.status(200).json({
      success: true,
      message: "Timesheet status fetched successfully",
      pagination: {
        totalRecords,
        currentPage: page,
        totalPages: Math.ceil(totalRecords / limit),
        pageSize: timesheets.length,
      },
      data: timesheets,
    });
  } catch (e) {
    console.error("Error in getTimesheetStatusByEmployee:", e);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: e.message,
    });
  }
};

const getTimesheetStatusByTeam = async (req, res) => {
  try {
    let {
      employee_id,
      date,
      search,
      page = 1,
      limit = 10,
      sortBy = "date",
      order = "desc",
    } = req.body;

    if (!employee_id) {
      return res.status(400).json({
        success: false,
        message: "Please provide employee_id.",
      });
    }

    // 1. Find team members where this employee is lead OR manager
    const teams = await employeeModel
      .find({
        $or: [{ team_lead_id: employee_id }, { team_managers_id: employee_id }],
      })
      .select("_id");

    if (!teams || teams.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No teams found for this employee",
      });
    }

    const teamIds = teams.map((t) => t._id);

    // 📅 Date range setup
    let start, end;
    if (date) {
      start = moment.tz(date, "Asia/Kolkata").startOf("day").toDate();
      end = moment.tz(date, "Asia/Kolkata").endOf("day").toDate();
    } else {
      start = moment().tz("Asia/Kolkata").startOf("day").toDate();
      end = moment().tz("Asia/Kolkata").endOf("day").toDate();
    }

    // ↕ Sorting
    const sortObj = {};
    sortObj[sortBy] = order.toLowerCase() === "asc" ? 1 : -1;

    // 📊 Pagination
    page = parseInt(page);
    limit = parseInt(limit);
    const skip = (page - 1) * limit;

    // 📝 Build aggregation pipeline
    const pipeline = [
      {
        $match: {
          employee: { $in: teamIds },
          date: { $gte: start, $lte: end },
        },
      },
      {
        $lookup: {
          from: "employees",
          localField: "employee",
          foreignField: "_id",
          as: "employee",
        },
      },
      { $unwind: "$employee" },
      {
        $lookup: {
          from: "employees",
          localField: "approvedBy",
          foreignField: "_id",
          as: "approvedBy",
        },
      },
      { $unwind: { path: "$approvedBy", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "employees",
          localField: "rejectedBy",
          foreignField: "_id",
          as: "rejectedBy",
        },
      },
      { $unwind: { path: "$rejectedBy", preserveNullAndEmptyArrays: true } },
      // 🔍 Search filter
      ...(search
        ? [
            {
              $match: {
                $or: [
                  { "employee.first_name": { $regex: search, $options: "i" } },
                  { "employee.last_name": { $regex: search, $options: "i" } },
                ],
              },
            },
          ]
        : []),
      {
        $project: {
          _id: 1,
          date: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$date",
              timezone: "Asia/Kolkata",
            },
          },
          submitStatus: 1,
          // rejectedReason: 1,
          // submittedAt: 1,
          submittedAt: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$submittedAt",
              timezone: "Asia/Kolkata",
            },
          },
          full_name: {
            $trim: {
              input: {
                $concat: [
                  { $ifNull: ["$employee.first_name", ""] },
                  " ",
                  { $ifNull: ["$employee.last_name", ""] },
                ],
              },
            },
          },
          employee_number: "$employee.employee_number",
          // approvedBy: {
          //   $cond: [
          //     { $ifNull: ["$approvedBy", false] },
          //     { $concat: ["$approvedBy.first_name", " ", "$approvedBy.last_name"] },
          //     null,
          //   ],
          // },
          // rejectedBy: {
          //   $cond: [
          //     { $ifNull: ["$rejectedBy", false] },
          //     { $concat: ["$rejectedBy.first_name", " ", "$rejectedBy.last_name"] },
          //     null,
          //   ],
          // },
        },
      },
      { $sort: sortObj },
      { $skip: skip },
      { $limit: limit },
    ];

    const timesheets = await timesheetModel.aggregate(pipeline);

    // 📊 Count aggregation
    const countPipeline = [
      {
        $match: {
          employee: { $in: teamIds },
          date: { $gte: start, $lte: end },
        },
      },
      {
        $lookup: {
          from: "employees",
          localField: "employee",
          foreignField: "_id",
          as: "employee",
        },
      },
      { $unwind: "$employee" },
      ...(search
        ? [
            {
              $match: {
                $or: [
                  { "employee.first_name": { $regex: search, $options: "i" } },
                  { "employee.last_name": { $regex: search, $options: "i" } },
                ],
              },
            },
          ]
        : []),
      { $count: "total" },
    ];

    const totalResult = await timesheetModel.aggregate(countPipeline);
    const totalRecords = totalResult.length > 0 ? totalResult[0].total : 0;

    res.status(200).json({
      success: true,
      message: "Timesheet status fetched successfully",
      pagination: {
        totalRecords,
        currentPage: page,
        totalPages: Math.ceil(totalRecords / limit),
        pageSize: timesheets.length,
      },
      data: timesheets,
    });
  } catch (e) {
    console.error("Error in getTimesheetStatusByTeam:", e);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: e.message,
    });
  }
};

const getTimesheetStatusByDate = async (req, res) => {
  try {
    const { date } = req.body;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: "Please provide date.",
      });
    }

    // 1. Find teams where this employee is lead OR manager
    // const teams = await employeeModel.find({
    //   $or: [
    //     { team_lead_id: employee_id },
    //     { team_managers_id: employee_id }
    //   ]
    // }).select("_id");

    // if (!teams || teams.length === 0) {
    //   return res.status(404).json({
    //     success: false,
    //     message: "No teams found for this employee",
    //   });
    // }

    // const teamIds = teams.map(t => t._id);
    // // normalize dates to IST
    const start = moment.tz(date, "Asia/Kolkata").startOf("day").toDate();
    const end = moment.tz(date, "Asia/Kolkata").endOf("day").toDate();

    const timesheets = await timesheetModel
      .find(
        {
          // employee: teamIds,
          date: { $gte: start, $lte: end },
        },
        {
          _id: 1,
          date: 1,
          submitStatus: 1,
          approvedBy: 1,
          rejectedReason: 1,
          submittedAt: 1,
        }
      )
      .sort({ date: 1 })
      .populate("employee", "first_name last_name")
      .populate("approvedBy", "first_name last_name") // 👈 add this
      .populate("rejectedBy", "first_name last_name"); // 👈 optional;

    const formatted = timesheets.map((t) => {
      return {
        ...t.toObject(),
        approvedBy: t.approvedBy
          ? `${t.approvedBy.first_name} ${t.approvedBy.last_name}`
          : null,
        rejectedBy: t.rejectedBy
          ? `${t.rejectedBy.first_name} ${t.rejectedBy.last_name}`
          : null,
      };
    });

    res.status(200).json({
      success: true,
      message: "Timesheet status fetched successfully",
      data: formatted,
    });
  } catch (e) {
    console.error("Error in getTimesheetStatus:", e);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: e.message,
    });
  }
};

const reassignTimesheet = async (req, res) => {
  try {
    const { timesheetId, reassignedBy, reason } = req.body;

    if (!timesheetId || !reassignedBy) {
      return res.status(400).json({
        success: false,
        message: "timesheetId and reassignedBy are required",
      });
    }

    const timesheet = await timesheetModel.findById(timesheetId);

    if (!timesheet) {
      return res.status(404).json({
        success: false,
        message: "Timesheet not found",
      });
    }

    // Update status to reassign
    timesheet.submitStatus = 5; // reassign
    timesheet.rejectedBy = reassignedBy; // storing manager/lead who reassigned
    timesheet.rejectedReason = reason || "Timesheet sent back for correction";
    timesheet.updatedAt = moment().tz("Asia/Kolkata").toDate();

    await timesheet.save();

    return res.json({
      success: true,
      message: "Timesheet reassigned successfully",
      // data: timesheet.toJSON(),
    });
  } catch (err) {
    console.error("reassignTimesheet error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const approveTimesheet = async (req, res) => {
  try {
    const { timesheetId, approvedBy } = req.body;

    if (!timesheetId || !approvedBy) {
      return res.status(400).json({
        success: false,
        message: "timesheetId and approvedBy are required",
      });
    }

    const timesheet = await timesheetModel.findById(timesheetId);

    if (!timesheet) {
      return res.status(404).json({
        success: false,
        message: "Timesheet not found",
      });
    }

    // Update status to reassign
    timesheet.submitStatus = 3; // reassign
    timesheet.approvedBy = approvedBy; // storing manager/lead who reassigned
    // timesheet.rejectedReason = reason || "Timesheet sent back for correction";
    timesheet.updatedAt = moment().tz("Asia/Kolkata").toDate();

    await timesheet.save();

    return res.json({
      success: true,
      message: "Timesheet Approved Successfully",
      // data: timesheet.toJSON(),
    });
  } catch (err) {
    console.error("reassignTimesheet error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  addWorkReport,
  getWorkReport,
  getTimesheetStatusByEmployee,
  getTimesheetStatusByTeam,
  getTimesheetStatusByDate,
  reassignTimesheet,
  approveTimesheet,
};
