const employeeService = require("../services/employee.service");
const { v4: uuidv4 } = require("uuid");
const ExcelJS = require("exceljs");
const employeeModel = require("../models/employee.model");
const designationModel = require("../models/designation.model");
const departmentModel = require("../models/department.model");
const { uploadToS3 } = require("../config/aws");
const {
  allowedDocTypes,
  EmployeeDocuments,
} = require("../models/documents.model");
const { default: mongoose } = require("mongoose");

// // const AWS = require("aws-sdk");
// const { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, ListObjectsV2Command } = require("@aws-sdk/client-s3");

// const s3 = new S3Client({
//   region: process.env.AWS_REGION,
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   },
// });

// AWS.config.update({
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   region: process.env.AWS_REGION,
// });

// const s3 = new AWS.S3();

// async function uploadToS3(file, folder = "employee_docs") {
//   // console.log("folder")
//   try {
//     const fileName = `${folder}/${uuidv4()}_${file.originalname}`;
//     const params = {
//       Bucket: process.env.AWS_BUCKET_NAME,
//       Key: fileName,
//       Body: file.buffer,
//       ContentType: file.mimetype,
//       // ACL: 'public-read',
//     };

//     const uploaded = await s3.upload(params).promise();
//     // console.log("uploaded-->",uploaded)
//     return uploaded.Location;
//   } catch (e) {
//     console.log("error --> ", e);
//     return "";
//   }
// }

// async function uploadToS3(file, folder = "employee_docs") {
//   try {
//     const fileName = `${folder}/${uuidv4()}_${file.originalname}`;
//     const params = {
//       Bucket: process.env.AWS_BUCKET_NAME,
//       Key: fileName,
//       Body: file.buffer,
//       ContentType: file.mimetype,
//       // ACL: "public-read", // uncomment if you want public file access
//     };

//     // v3: use PutObjectCommand
//     const command = new PutObjectCommand(params);
//     await s3.send(command);

//     // In v3, no `Location` in response → build URL manually
//     const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;

//     consol.log("fileName ---> ", fileName)
//     consol.log("fileUrl ---> ", fileUrl)

//     return fileName;
//   } catch (e) {
//     console.error("S3 upload error:", e);
//     return "";
//   }
// }

async function addNewEmployee(req, res) {
  try {
    // console.log("inside add employee....!");
    // console.log("req.body ---> ", req.body);
    console.log("files --> ", req.files);
    let {
      employee_id,
      role_id,
      team_lead_id,
      team_managers_id,
      first_name,
      middle_name,
      last_name,
      company_email,
      password,
      personal_email,
      designation,
      sub_designation,
      is_team_lead,
      department,
      employment_type,
      employee_number,
      alternate_number,
      emergency_number,
      family_member_relation,
      current_address,
      // is_current_add_same_as_permanent,
      permanent_address,
      date_of_birth,
      gender,
      blood_group,
      work_mode,
      date_of_joining,
      notice_period,
      work_experience,
      salary,
      bank_name,
      bank_account_number,
      ifsc_code,
      is_active,
      tenth_passing_year,
      tenth_percentage,
      twelfth_passing_year,
      twelfth_percentage,
      graduation_passing_year,
      graduation_percentage,
      post_graduation_passing_year,
      post_graduation_percentage,
      // aadhar_card,
      aadhar_card_number,
      // pan_card,
      pan_card_number,
      // passport_photo,
      // employee_sign,
      // tenth_certificate,
      // twelfth_certificate,
      // graduation_certificate,
      // resume,
      // previous_pay_slips,
      // previous_offer_letter,
      // previous_experience_letter,
      // form16,
      pf_account_number,
      uan_number,
      esi_number,
      // assigned_menus,
    } = req.body;

    // if (!employee_id) {
    //   return res.status(200).json({
    //     success: false,
    //     message: "Please Provide employee_id",
    //   });
    // }

    // employee_id = employee_id.trim();
    // const existingEmployee = await employeeService.getEmployeeByEmployeeId(
    //   employee_id
    // );
    // if (existingEmployee) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Employee ID already exists. Cannot upload documents.",
    //   });
    // }

    // let pwd;
    // let rw_agreement_accepted; -- done
    let internship_ends_on = "";
    let probation_period_ends_on = "";
    // let last_working_day;
    // let company_policy_accept

    if (employment_type == "INTERNSHIP") {
      const today = new Date();
      const sixMonthsLater = new Date();
      sixMonthsLater.setMonth(today.getMonth() + 6);
      internship_ends_on = sixMonthsLater.toISOString().split("T")[0];
    } else if (employment_type == "FULLTIME") {
      const today = new Date();
      const sixMonthsLater = new Date();
      sixMonthsLater.setMonth(today.getMonth() + 3);
      probation_period_ends_on = sixMonthsLater.toISOString().split("T")[0];
    }

    // console.log("internship_ends_on-->",internship_ends_on);
    // console.log("probation_period_ends_on-->",probation_period_ends_on);
    // const parsed_assigned_menus = assigned_menus;
    // console.log("assigned_menus-->",parsed_assigned_menus, typeof parsed_assigned_menus)

    let teamManagers = [];
    if (team_managers_id) {
      // console.log("teamManagers 1 ---> ", teamManagers);
      if (typeof team_managers_id === "string") {
        try {
          // console.log("teamManagers 2 ---> ", teamManagers);
          teamManagers = JSON.parse(team_managers_id);
        } catch (e) {
          console.log("error--->,", e);
          // console.log("teamManagers 3 ---> ", teamManagers);
          teamManagers = [];
        }
      } else if (Array.isArray(team_managers_id)) {
        // console.log("teamManagers 4 ---> ", teamManagers);
        teamManagers = team_managers_id;
      }
    }
    // console.log("teamManagers ---> ", teamManagers);

    const data = {
      employee_id,
      role_id,
      team_lead_id,
      team_managers_id: teamManagers,
      first_name,
      middle_name,
      last_name,
      company_email,
      password,
      personal_email,
      department_id: department,
      designation_id: designation,
      sub_designation_id: sub_designation,
      is_team_lead,
      employment_type,
      employee_number,
      alternate_number,
      emergency_number,
      family_member_relation,
      current_address,
      // is_current_add_same_as_permanent,
      permanent_address,
      date_of_birth,
      gender,
      blood_group,
      work_mode,
      date_of_joining,
      notice_period,
      work_experience,
      salary,
      bank_name,
      bank_account_number,
      ifsc_code,
      is_active,
      tenth_passing_year,
      tenth_percentage,
      twelfth_passing_year,
      twelfth_percentage,
      graduation_passing_year,
      graduation_percentage,
      post_graduation_passing_year,
      post_graduation_percentage,
      // aadhar_card,
      aadhar_card_number,
      // pan_card,
      pan_card_number,
      // passport_photo,
      // employee_sign,
      // tenth_certificate,
      // twelfth_certificate,
      // graduation_certificate,
      // resume,
      // previous_pay_slips,
      // previous_offer_letter,
      // previous_experience_letter,
      // form16,
      pf_account_number,
      uan_number,
      esi_number,
      internship_ends_on,
      probation_period_ends_on,
      // assigned_menus: parsed_assigned_menus,
    };
    const employee = await employeeService.createEmployee(data);

    let _id = employee._id;

    const files = req.files;
    // const aadhar_card = files?.aadhar_card?.[0]
    //   ? await uploadToS3(files.aadhar_card[0], `employee_docs/${_id}`)
    //   : "";
    // const pan_card = files?.pan_card?.[0]
    //   ? await uploadToS3(files.pan_card[0], `employee_docs/${_id}`)
    //   : "";
    // const passport_photo = files?.passport_photo?.[0]
    //   ? await uploadToS3(
    //       files.passport_photo[0],
    //       `employee_docs/${_id}`
    //     )
    //   : "";
    // const employee_sign = files?.employee_sign?.[0]
    //   ? await uploadToS3(files.employee_sign[0], `employee_docs/${_id}`)
    //   : "";
    // const tenth_certificate = files?.tenth_certificate?.[0]
    //   ? await uploadToS3(
    //       files.tenth_certificate[0],
    //       `employee_docs/${_id}`
    //     )
    //   : "";
    // const twelfth_certificate = files?.twelfth_certificate?.[0]
    //   ? await uploadToS3(
    //       files.twelfth_certificate[0],
    //       `employee_docs/${_id}`
    //     )
    //   : "";
    // const graduation_certificate = files?.graduation_certificate?.[0]
    //   ? await uploadToS3(
    //       files.graduation_certificate[0],
    //       `employee_docs/${_id}`
    //     )
    //   : "";
    // const resume = files?.resume?.[0]
    //   ? await uploadToS3(files.resume[0], `employee_docs/${_id}`)
    //   : "";
    // const previous_pay_slips = files?.previous_pay_slips?.[0]
    //   ? await uploadToS3(
    //       files.previous_pay_slips[0],
    //       `employee_docs/${_id}`
    //     )
    //   : "";
    // const previous_offer_letter = files?.previous_offer_letter?.[0]
    //   ? await uploadToS3(
    //       files.previous_offer_letter[0],
    //       `employee_docs/${_id}`
    //     )
    //   : "";
    // const previous_experience_letter = files?.previous_experience_letter?.[0]
    //   ? await uploadToS3(
    //       files.previous_experience_letter[0],
    //       `employee_docs/${_id}`
    //     )
    //   : "";
    // const form16 = files?.form16?.[0]
    //   ? await uploadToS3(files.form16[0], `employee_docs/${_id}`)
    //   : "";

    for (const [docType, fileArr] of Object.entries(files)) {
      if (!allowedDocTypes.includes(docType)) {
        console.warn(`Skipping invalid document type: ${docType}`);
        continue; // skip if not valid
      }

      if (fileArr && fileArr.length > 0) {
        console.log("fileArr ---> ", fileArr);
        // Salary slips → multiple documents
        if (docType === "salary_slips" || docType === "previous_pay_slips") {
          const uploadedFiles = [];

          // upload all given files
          for (const file of fileArr) {
            const uploadedFile = await uploadToS3(file, `employee_docs/${_id}`);

            if (uploadedFile !== "") {
              uploadedFiles.push({ path: uploadedFile });
            }
          }
          if (uploadedFiles.length > 0) {
            await EmployeeDocuments.create({
              employee_id: _id,
              document_type: docType,
              files: uploadedFiles,
            });
          }
        } else {
          // Other docs → just the first file
          const uploadedFile = await uploadToS3(
            fileArr[0],
            `employee_docs/${_id}`
          );

          if (uploadedFile !== "") {
            await EmployeeDocuments.create({
              employee_id: _id,
              document_type: docType,
              files: [{ path: uploadedFile }],
            });
          }
        }
      }
    }
    // const employeeDocument = await employeeService.addDocument({ aadhar_card });
    return res.status(200).json({
      success: true,
      message: "New Employee Added Success..!",
      // data: employee
      _id: employee._id,
    });
  } catch (error) {
    console.log("error-->", error);
    let message = "Something went wrong.";
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      message = `${field} already exists.`;
    }
    return res.status(500).json({
      message: message,
      success: false,
      error: error.message,
    });
  }
}

const getAll = async (req, res) => {
  try {
    const search = req.query?.search || "";
    const page = parseInt(req.query?.page) || 1;
    const limit = parseInt(req.query?.limit) || 10;
    const sortBy = req.query?.sortBy || "createdAt";
    const sortOrder = req.query?.order === "asc" ? 1 : -1;

    const skip = (page - 1) * limit;

    // search filter
    let match = {};
    if (search) {
      match = {
        $or: [
          { company_email: { $regex: search, $options: "i" } },
          { employee_number: { $regex: search, $options: "i" } },
          { first_name: { $regex: search, $options: "i" } },
          { last_name: { $regex: search, $options: "i" } },
        ],
      };
    }

    const pipeline = [
      { $match: match },
      {
        $lookup: {
          from: "designations", // 👈 collection name
          localField: "designation_id",
          foreignField: "_id",
          as: "designation",
        },
      },
      { $unwind: { path: "$designation", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          full_name: {
            $trim: {
              input: {
                $concat: [
                  { $ifNull: ["$first_name", ""] },
                  " ",
                  { $ifNull: ["$last_name", ""] },
                ],
              },
            },
          },
          company_email: 1,
          employee_number: 1,
          is_active: 1,
          rw_agreement_accepted: 1,
          designation_name: "$designation.designation_name",
          date_of_joining: {
            $dateToString: {
              format: "%d-%m-%Y", // 👈 Indian format (DD-MM-YYYY)
              date: "$date_of_joining",
              timezone: "Asia/Kolkata", // 👈 apply IST (UTC+5:30)
            },
          },
        },
      },
      { $sort: { [sortBy]: sortOrder } },
      { $skip: skip },
      { $limit: limit },
    ];

    const employees = await employeeModel.aggregate(pipeline);

    const totalEmployees = await employeeModel.countDocuments(match);

    return res.status(200).json({
      success: true,
      message: "Employee List Fetched!",
      data: employees,
      pagination: {
        total: totalEmployees,
        page,
        limit,
        totalPages: Math.ceil(totalEmployees / limit),
      },
    });
  } catch (e) {
    console.log("e --> ", e);
    return res.status(500).json({
      success: false,
      message: "Something went wrong!",
      error: e.message,
    });
  }
};

const getById = async (req, res) => {
  try {
    const employee = await employeeService.getEmployeeById(req.params.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    // Fetch employee documents
    const documents = await employeeService.getEmployeeDocuments(req.params.id);

    return res.json({
      success: true,
      data: {
        ...employee.toObject(),
        documents,
      },
    });
  } catch (error) {
    console.error("Get Employee By Id Error -->", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching employee",
      error: error.message,
    });
  }
};

const getTeamLeads = async (req, res) => {
  try {
    // find all departments with slug starting with "project-manager"
    const designations = await designationModel.find({
      designation_slug: { $regex: "^(lead|.*lead$)", $options: "i" },
    });

    if (!designations || designations.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No 'lead' designations found",
      });
    }

    // extract ids
    const designationIds = designations.map((dep) => dep._id);

    console.log("designationIds ---> ", designationIds);

    // fetch employees whose designation is in these department ids
    const teamLeads = await employeeModel
      .find({
        designation_id: { $in: designationIds }, // <-- singular
      })
      .select("first_name last_name company_email designation role_id");

    console.log("teamLeads ---> ", teamLeads);
    return res.status(200).json({
      success: true,
      count: teamLeads.length,
      data: teamLeads,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching team managers",
      error: error.message,
    });
  }
};

const getTeamManagers = async (req, res) => {
  try {
    // find all departments with slug starting with "project-manager"
    const designations = await designationModel.find({
      designation_slug: { $regex: "^(manager|.*manager$)", $options: "i" },
    });

    if (!designations || designations.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No 'project-manager' designations found",
      });
    }

    // extract ids
    const designationIds = designations.map((dep) => dep._id);

    // console.log("designationIds ---> ", designationIds);

    // fetch employees whose designation is in these department ids
    const teamManagers = await employeeModel
      .find({
        designation_id: { $in: designationIds }, // <-- singular
      })
      .select("first_name last_name company_email designation role_id");

    // console.log("teamManagers ---> ", teamManagers);
    return res.status(200).json({
      success: true,
      count: teamManagers.length,
      data: teamManagers,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching team managers",
      error: error.message,
    });
  }
};

// const create = async (req, res) => {
//   const employee = await employeeService.createEmployee(req.body);
//   res.status(201).json(employee);
// };

// const update = async (req, res) => {
//   const employee = await employeeService.updateEmployee(
//     req.params.id,
//     req.body
//   );
//   return res.json({
//     success: true,
//     message: "Employee Updated Successfully!"
//   });
// };

// const remove = async (req, res) => {
//   await employeeService.deleteEmployee(req.params.id);
//   res.status(204).end();
// };

const downloadEmployeeList = async (req, res) => {
  try {
    console.log("inside employees--");
    const employees = await employeeService.getAllEmployees();
    // console.log("employees-->",employees)
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Employees");

    worksheet.columns = [
      { header: "Employee Name", key: "employee_name", width: 20 },
      { header: "Employee Contact", key: "contact", width: 20 },
      { header: "Email ID", key: "email", width: 25 },
      { header: "EmpID", key: "employee_id", width: 20 },
      { header: "Department", key: "department", width: 20 },
      { header: "Designation", key: "designation", width: 25 },
      { header: "Date of Joining", key: "date_of_joining", width: 20 },
      { header: "Date of Birth", key: "date_of_birth", width: 20 },
      { header: "PAN", key: "pan", width: 15 },
      { header: "Personal Email", key: "personal_email", width: 20 },
      { header: "Emergency Contact", key: "emergency_contact", width: 20 },
      { header: "Adhar No", key: "adhar_no", width: 15 },
      { header: "Current Address", key: "current_address", width: 25 },
      { header: "Permanent address", key: "permanent_address", width: 25 },
    ];

    employees.forEach((emp) => {
      worksheet.addRow({
        employee_name: emp.first_name + emp.last_name,
        contact: emp.employee_number,
        email: emp.company_email,
        employee_id: emp.employee_id,
        department: emp.department,
        designation: emp.designation,
        date_of_joining: emp.date_of_joining,
        date_of_birth: emp.date_of_birth,
        pan: emp.pan_card_number,
        personal_email: emp.personal_email,
        emergency_contact: emp.emergency_number,
        adhar_no: emp.aadhar_card_number,
        current_address: emp.current_address,
        permanent_address: emp.permanent_address,
      });
    });

    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="employees.xlsx"'
    );
    await workbook.xlsx.write(res);
    res.end();

    // res.status(200).json({
    //   success: true,
    //   message: "Employee List Downloaded successfully...!",
    //   // data: updatedEmployee
    // });
  } catch (error) {
    console.log("error-->", error.message);
    res.status(500).json({
      success: false,
      message: "Error While downloading employee...!",
    });
  }
};

const updateEmployee = async (req, res) => {
  try {
    const { _id, data } = req.body;

    if (!_id || !data || Object.keys(data).length == 0) {
      return res.status(400).json({
        success: false,
        message: "Employee _id and data are required",
      });
    }

    let {
      role_id,
      team_managers_id,
      first_name,
      last_name,
      company_email,
      password,
      personal_email,
      designation_id,
      employment_type,
      employee_number,
      alternate_number,
      emergency_number,
      family_member_relation,
      current_address,
      permanent_address,
      probation_period_ends_on,
      date_of_birth,
      gender,
      blood_group,
      rw_agreement_accepted,
      date_of_joining,
      internship_ends_on,
      bank_account_number,
      bank_name,
      ifsc_code,
      is_active,
      comp_off,
      company_policy_accept,
      tenth_passing_year,
      tenth_percentage,
      twelfth_passing_year,
      twelfth_percentage,
      graduation_passing_year,
      graduation_percentage,
      post_graduation_passing_year,
      post_graduation_percentage,
      aadhar_card_number,
      pan_card_number,
      pf_account_number,
      uan_number,
      esi_number,
      department_id,
      background_verification,
    } = data;

    let updatedData = {
      role_id,
      team_managers_id,
      first_name,
      last_name,
      company_email,
      password,
      personal_email,
      designation_id,
      employment_type,
      employee_number,
      alternate_number,
      emergency_number,
      family_member_relation,
      current_address,
      permanent_address,
      probation_period_ends_on,
      date_of_birth,
      gender,
      blood_group,
      rw_agreement_accepted,
      date_of_joining,
      internship_ends_on,
      bank_account_number,
      bank_name,
      ifsc_code,
      is_active,
      comp_off,
      company_policy_accept,
      tenth_passing_year,
      tenth_percentage,
      twelfth_passing_year,
      twelfth_percentage,
      graduation_passing_year,
      graduation_percentage,
      post_graduation_passing_year,
      post_graduation_percentage,
      aadhar_card_number,
      pan_card_number,
      pf_account_number,
      uan_number,
      esi_number,
      department_id,
      background_verification,
    };

    const updatedEmployee = await employeeService.updateEmployee(
      _id,
      updatedData
    );

    if (!updatedEmployee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found with given _id",
      });
    }

    res.status(200).json({
      success: true,
      message: "Employee updated successfully",
    });
  } catch (error) {
    console.error("Update Error:", error);

    // Invalid ObjectId format
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid Employee ID format",
      });
    }

    // Mongoose validation errors (enum, required, minlength, etc.)
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: errors.join(", "),
      });
    }

    // Duplicate key error (unique index violations)
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        success: false,
        message: `${field} already exists.`,
      });
    }

    // if (
    //   error.message.includes("ECONNREFUSED") ||
    //   error.message.includes("timed out")
    // ) {
    //   return res.status(503).json({
    //     success: false,
    //     message: "Service unavailable. Database connection failed.",
    //   });
    // }

    // Fallback
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message, // optional: remove in production
    });
  }
};

const updateEmployeeStatus = async (req, res) => {
  try {
    const { _id, is_active } = req.body;

    if (!_id) {
      return res.status(400).json({
        success: false,
        message: "Employee _id Is Required",
      });
    }

    const updateData = {
      is_active: is_active,
    };

    const updatedEmployee = await employeeService.updateEmployee(
      _id,
      updateData
    );

    if (!updatedEmployee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found with given _id",
      });
    }

    res.status(200).json({
      success: true,
      message: "Employee Status updated successfully...!",
      // data: updatedEmployee,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error While updating employee status...!",
      error: error.message,
    });
  }
};

async function acceptWRAgreement(req, res) {
  try {
    const _id = req.body._id;
    const rw_agreement_accepted = req.body.rw_agreement_accepted;
    // console.log("rw_agreement_accepted-->", rw_agreement_accepted);
    if (!_id) {
      return res.status(400).json({
        success: false,
        message: "Employee _id Is Required",
      });
    }

    const employee = await employeeService.getEmployeeById(_id);

    if (!employee) {
      return res.status(400).json({
        success: false,
        message: "No Record Found For This Employee ID",
      });
    }

    const work_mode = employee.work_mode;
    if (work_mode != "WFH") {
      return res.status(400).json({
        success: false,
        message: "Not Applicable For This Employee..",
      });
    }

    const updateEmp = await employeeService.updateEmployee(_id, {
      rw_agreement_accepted: rw_agreement_accepted,
    });

    return res.status(200).json({
      message: "Successfully Updated Remote Work Agreement Status...!",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error While Accept Remote Agreement",
      success: false,
    });
  }
}

// async function getAllEmployeesOnCondition(req, res) {
//   try {
//     const field = req.body.field;
//     const value = req.body.value;

//     const query = {
//       [field]: value,
//     };
//     const result = await employeeService.getEmployeesOnCondition(query);

//     return res.status(200).json({
//       message: "Employee Fetched Success...!",
//       success: true,
//       data: result,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       message: "Error While Getting Employees",
//       success: false,
//     });
//   }
// }

async function teamHierarchy(req, res) {
  const search = req.query?.search || "";
  const page = parseInt(req.query?.page) || 1;
  const limit = parseInt(req.query?.limit) || 10;
  const skip = (page - 1) * limit;

  // sort params
  const sortBy = req.query?.sortBy || "createdAt";
  const sortOrder = req.query?.sortOrder === "asc" ? 1 : -1;

  // search filter
  let filter = {};
  if (search) {
    filter = {
      $or: [
        { company_email: { $regex: search, $options: "i" } },
        { employee_number: { $regex: search, $options: "i" } },
        { first_name: { $regex: search, $options: "i" } },
        { last_name: { $regex: search, $options: "i" } },
      ],
    };
  }

  try {
    const pipeline = [
      { $match: filter },

      // designation join
      {
        $lookup: {
          from: "designations",
          localField: "designation_id",
          foreignField: "_id",
          as: "designation",
        },
      },
      { $unwind: { path: "$designation", preserveNullAndEmptyArrays: true } },

      // department join
      {
        $lookup: {
          from: "departments",
          localField: "department_id",
          foreignField: "_id",
          as: "department",
        },
      },
      { $unwind: { path: "$department", preserveNullAndEmptyArrays: true } },

      // team lead join
      {
        $lookup: {
          from: "employees",
          localField: "team_lead_id",
          foreignField: "_id",
          as: "team_lead",
        },
      },
      { $unwind: { path: "$team_lead", preserveNullAndEmptyArrays: true } },

      // team managers join
      {
        $lookup: {
          from: "employees", // collection name
          localField: "team_managers_id", // array of manager IDs
          foreignField: "_id",
          as: "team_managers", // result array
        },
      },
      // { $unwind: { path: "$team_managers", preserveNullAndEmptyArrays: true } },

      // role join
      {
        $lookup: {
          from: "roles", // ✅ collection name (plural)
          localField: "role_id", // field in Employee
          foreignField: "_id", // field in Role
          as: "role",
        },
      },
      { $unwind: { path: "$role", preserveNullAndEmptyArrays: true } },

      // project only required fields
      {
        $project: {
          employee_id: 1,
          full_name: {
            $trim: {
              input: {
                $concat: [
                  { $ifNull: ["$first_name", ""] },
                  " ",
                  { $ifNull: ["$last_name", ""] },
                ],
              },
            },
          },
          designation_name: "designation.designation_name",
          department_name: "department.department_name",
          date_of_joining: 1,
          work_mode: 1,
          role_name: "$role.role_name",
          employee_number: 1,
          company_email: 1,
          team_lead_full_name: {
            $trim: {
              input: {
                $concat: [
                  { $ifNull: ["$team_lead.first_name", ""] },
                  " ",
                  { $ifNull: ["$team_lead.last_name", ""] },
                ],
              },
            },
          },
          team_managers: {
            $map: {
              input: "$team_managers",
              as: "manager",
              in: {
                full_name: {
                  $trim: {
                    input: {
                      $concat: [
                        { $ifNull: ["$$manager.first_name", ""] },
                        " ",
                        { $ifNull: ["$$manager.last_name", ""] },
                      ],
                    },
                  },
                },
              },
            },
          },
        },
      },

      { $sort: { [sortBy]: sortOrder } },
      { $skip: skip },
      { $limit: limit },
    ];

    const result = await employeeModel.aggregate(pipeline);

    const total = await employeeModel.countDocuments(filter);

    return res.status(200).json({
      message: "Fetched Team Hierarchy",
      success: true,
      data: result,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("teamHierarchy error -->", error.message);
    return res.status(500).json({
      success: false,
      message: "Error While Fetching Team Hierarchy..! 🚨",
      error: error.message,
    });
  }
}

async function uploadEmployeeDocument(req, res) {
  try {
    let _id = req.body._id;
    const files = req.files;
    // convert safely
    _id = new mongoose.Types.ObjectId(_id);

    for (const [docType, fileArr] of Object.entries(files)) {
      if (!allowedDocTypes.includes(docType)) {
        console.warn(`Skipping invalid document type: ${docType}`);
        continue; // skip if not valid
      }

      if (fileArr && fileArr.length > 0) {
        // Salary slips / previous pay slips → multiple documents in same record
        const uploadedFiles = [];

        for (const file of fileArr) {
          const uploadedFile = await uploadToS3(file, `employee_docs/${_id}`);

          if (uploadedFile) {
            uploadedFiles.push({ path: uploadedFile });
          }
        }

        if (uploadedFiles.length > 0) {
          const existingDoc = await EmployeeDocuments.findOne({
            employee_id: _id,
            document_type: docType,
            status: 1,
          });

          if (existingDoc) {
            // ✅ Push new into existing record
            await EmployeeDocuments.updateOne(
              { _id: existingDoc._id },
              { $push: { files: { $each: uploadedFiles } } }
            );
          } else {
            // ✅ Create new record if not exists
            await EmployeeDocuments.create({
              employee_id: _id,
              document_type: docType,
              files: uploadedFiles,
            });
          }
        }
      }
    }

    return res.status(200).json({
      success: true,
      message: "Document Uploaded Successfully..! 🚀",
      employee_id: _id,
    });
  } catch (error) {
    console.error("Upload Error -->", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while uploading documents",
      error: error.message,
    });
  }
}

// Mark a document inactive
// async function markDocumentInactive(req, res) {
//   try {
//     const { document_id } = req.body;

//     if (!mongoose.Types.ObjectId.isValid(document_id)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid document_id",
//       });
//     }

//     const updatedDoc = await EmployeeDocuments.findByIdAndUpdate(
//       document_id,
//       { $set: { status: 0 } }, // 👈 mark inactive
//       { new: true }
//     );

//     if (!updatedDoc) {
//       return res.status(404).json({
//         success: false,
//         message: "Document not found",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       message: "Document marked as inactive successfully",
//       // data: updatedDoc,
//     });
//   } catch (error) {
//     console.error("Deactivate Error -->", error);
//     return res.status(500).json({
//       success: false,
//       message: "Something went wrong while deactivating document",
//       error: error.message,
//     });
//   }
// }

async function markDocumentOrFileInactive(req, res) {
  try {
    const { document_id, file_path } = req.body;

    if (!mongoose.Types.ObjectId.isValid(document_id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid document_id",
      });
    }

    let updatedDoc;

    if (file_path) {
      // ✅ Deactivate only the specific file inside files[]
      updatedDoc = await EmployeeDocuments.findOneAndUpdate(
        { _id: document_id, "files.path": file_path },
        { $set: { "files.$.status": 0 } },
        { new: true }
      );
    } else {
      // ✅ Deactivate the whole document
      updatedDoc = await EmployeeDocuments.findByIdAndUpdate(
        document_id,
        { $set: { status: 0 } },
        { new: true }
      );
    }

    if (!updatedDoc) {
      return res.status(404).json({
        success: false,
        message: file_path
          ? "Document or file not found"
          : "Document not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: file_path
        ? "File marked as inactive successfully"
        : "Document marked as inactive successfully",
      // data: updatedDoc,
    });
  } catch (error) {
    console.error("Mark Inactive Error -->", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while marking inactive",
      error: error.message,
    });
  }
}

module.exports = {
  // getFilteredEmployees,
  // create,
  // update,
  // remove,
  // activeInactiveEmployee,
  // getAllEmployeesOnCondition,
  getAll,
  getById,
  updateEmployee,
  updateEmployeeStatus,
  acceptWRAgreement,
  addNewEmployee,
  downloadEmployeeList,
  teamHierarchy,
  getTeamLeads,
  getTeamManagers,
  uploadEmployeeDocument,
  // markDocumentInactive,
  markDocumentOrFileInactive,
};
