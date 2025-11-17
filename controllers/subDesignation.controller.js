const subdesignationService = require("../services/subdesignation.service");

// async function addSubDesignation(req,res){
//     let reqData = req.body;
//     reqData = reqData.map((item) => {
//         return {
//             ...item,
//             status: item.status == 'active' ? 1 : 0
//         }
//     })
//     const data = await subdesignationService.addSubDesignation(reqData);
//     return res.status(200).json({
//         success: true,
//         message: "Sub Designation Added Success..!"
//     });
// }

// ✅ Add SubDesignation Controller
async function addSubDesignation(req, res) {
  try {
    let reqData = req.body.subdesignations;

    if (!Array.isArray(reqData) || reqData.length === 0) {
      return res.status(400).json({
        success: false,
        message: "subdesignations array is required"
      });
    }

    reqData = reqData.map((item) => {
      return {
        sub_designation_name: item.sub_designation_name,
        status: item.status === 'active' ? 1 : 0
      };
    });

    const data = await  subdesignationService.addSubDesignation(reqData);

    return res.status(200).json({
      success: true,
      message: "SubDesignation(s) Added Successfully!",
    //   data: data
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to add subdesignations",
      error: error.message
    });
  }
}

async function getAllSubDesignation(req,res){
    const data = await subdesignationService.getAllSubDesignation();
    // const updatedData = data.map(item => ({
    // ...item.toObject(),
    // status: item.status === 1 ? "Active" : "Inactive"
    // }));
    return res.status(200).json({
        success: true,
        message: "Sub Designations Fetched Success..!",
        data: data,
    });
}

async function updateSubDesignation(req,res){
    const id = req.body.sub_designation_id;
    const sub_designation_name = req.body.sub_designation_name;
    const status = req.body.status == 'active' ? 1 : 0;
    const query = {
        _id: id
    }
    const updateData = {
        $set: { sub_designation_name: sub_designation_name, status: status }
    }
    const data = await subdesignationService.updateSubDesignation(query, updateData);
    return res.status(200).json({
        success: true,
        message: "Sub Designation Updated Success..!"
    });
}

async function deleteSubDesignation(req,res){
    const sub_designation_id = req.body.sub_designation_id;
    const query = {
        _id: sub_designation_id
    }
    const data = await subdesignationService.deleteSubDesignation(query);
    return res.status(200).json({
        success: true,
        message: "Designation Deleted Success..!"
    });
}

module.exports = {
    addSubDesignation,
    getAllSubDesignation,
    updateSubDesignation,
    deleteSubDesignation,
}