const { default: mongoose } = require("mongoose");
const documentsModel = require("../models/documents.model");
const Employee = require("../models/employee.model");


const getAllEmployees = async () => {
  return await Employee.find()
  .populate("role_id", "role_name")
  .populate("team_lead_id", "first_name last_name")
  .populate("team_managers_id", "first_name last_name")
  .populate("department_id", "department_name")
  .populate("designation_id", "designation_name")
    .sort({ createdAt: -1 })
    .limit(10);
};

async function getAllFilteredEmployees(data){
  try{
    // console.log("data--->",data);
    let {search_text, page, limit} = data;
    page = parseInt(page);
    limit = parseInt(limit);
    const skip = (page - 1) * limit;

    const regex = new RegExp(search_text, "i");
    // console.log("regex-->",regex);

    const employees = await Employee.aggregate([
      {
        $lookup: {
          from: "designations",
          localField: "designation",
          foreignField: "_id",
          as: "designation"
        }
      },
      { $unwind: "$designation" }, 
      {
        $match: {
          $or: [
            { first_name: { $regex: regex } },   
            { middle_name: { $regex: regex } },
            { last_name: { $regex: regex } },
            { company_email: { $regex: regex } },
            // { date_of_joining: { $regex: regex } },
            // { rw_agreement_accepted: { $regex: regex } },
            // { is_active: { $regex: regex } },
            { "designation.designation_name": { $regex: regex } } 
          ]
        }
      },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $project: {                       
          first_name: 1,
          middle_name: 1,
          last_name: 1,
          company_email: 1,
          date_of_joining: 1,
          rw_agreement_accepted: 1,
          is_active: 1,
          "designation.designation_name": 1,
          createdAt: 1
        }
      }
    ]);
    return employees;

  }catch(error){
    console.log("error.message",error.message);
    return error;
  }
}
const createEmployee = (data) => Employee.create(data);
const getEmployeeById = (id) => Employee.findById(id);
const updateEmployee = (id, data) => Employee.findByIdAndUpdate(id, data, { new: true, runValidators: true });
const deleteEmployee = (id) => Employee.findByIdAndDelete(id);
const getEmployeesOnCondition = (query) => Employee.find(query);
const getEmployeeByEmployeeId = (employee_id) => Employee.findOne({employee_id: employee_id});
const addDocument = (data) => documentsModel.EmployeeDocuments.create(data);

async function teamHierarchy(){
  const result = await Employee.find()
    .populate("designation", "designation_name")   // designation name
    .populate("department", "department_name")                // department name
    .populate("team_lead_id", "first_name last_name company_email") // team lead info
    .sort({ createdAt: -1 })
    .limit(10);
    return result;
}

const getEmployeeDocuments = async (employeeId) => {
  const docs = await documentsModel.EmployeeDocuments.find(
    {
      employee_id: new mongoose.Types.ObjectId(employeeId),
      status: 1,
    },
    {
      document_type: 1,
      createdAt: 1,
      files: 1, // but includes file.status
    }
  ).lean();

  return docs.map((doc) => ({
    ...doc,
    files: doc.files
      .filter((f) => f.status === 1)
      // .map(({ path, _id, uploaded_at }) => ({ path, _id, uploaded_at })), // exclude status
      .map(({ path, _id, uploaded_at }) => ({ path, _id })), // exclude status
  }));
};


module.exports = {
  getAllEmployees,
  getAllFilteredEmployees,
  teamHierarchy,
  createEmployee,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  getEmployeesOnCondition,
  getEmployeeByEmployeeId,
  addDocument,
  getEmployeeDocuments,
};
