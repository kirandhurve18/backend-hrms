const designationService = require("../services/designation.service");

// async function addDesignation(req,res){
//     let reqData = req.body.designations;
//     reqData = reqData.map((item) => {
//         return {
//             designation_name: item.designation_name,
//             status: item.status == 'active' ? 1 : 0,

//         }
//     })
//     const data = await designationService.addDesignation(reqData);
//     return res.status(200).json({
//         success: true,
//         message: "Designation Added Success..!"
//     });
// }

async function addDesignation(req, res) {
  try {
    let reqData = req.body.designations;

    if (!Array.isArray(reqData) || reqData.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No designations provided",
      });
    }

    // Normalize request
    reqData = reqData.map((item) => ({
      designation_name: item.designation_name,
      departmentId: item.departmentId, // Make sure you pass departmentId from frontend
      status: item.status && item.status.toLowerCase() === "active" ? 1 : 0,
    }));

    await designationService.addDesignation(reqData);

    return res.status(200).json({
      success: true,
      message: "Designations Added Successfully..!",
    });
  } catch (error) {
    console.error("Error in addDesignation:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while adding designations",
      error: error.message,
    });
  }
}

// async function getAllDesignation(req,res){
//     const data = await designationService.getAllDesignation();
//     const updatedData = data.map(item => ({
//     ...item.toObject(),
//     status: item.status === 1 ? "Active" : "Inactive"
//     }));
//     return res.status(200).json({
//         success: true,
//         data: updatedData,
//         message: "Designations Fetched Success..!"
//     });
// }

async function getAllDesignation(req, res) {
  try {
    // const data = await designationService.getAllDesignation();
    const { departmentId } = req.query; // or req.body depending on frontend

    let data;
    if (departmentId) {
      // Fetch designations for a specific department
      data = await designationService.getAllDesignationByDepartment({ departmentId });
    } else {
      // Fetch all designations
      data = await designationService.getAllDesignation();
    }

    return res.status(200).json({
      success: true,
      message: "Departments Fetched Successfully..!",
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch departments",
      error: error.message,
    });
  }
}

async function updateDesignation(req, res) {
  const id = req.body.designation_id;
  const designation_name = req.body.designation_name;
  const departmentId = req.body.departmentId;
  const status = req.body.status == "active" ? 1 : 0;
  const query = {
    _id: id,
  };
  const updateData = {
    $set: {
      designation_name: designation_name,
      departmentId: departmentId,
      status: status,
    },
  };
  const data = await designationService.updateDesignation(query, updateData);
  return res.status(200).json({
    success: true,
    message: "Designation Updated Success..!",
  });
}

async function deleteDesignation(req, res) {
  const designation_id = req.body.designation_id;
  const query = {
    _id: designation_id,
  };
  const data = await designationService.deleteDesignation(query);
  return res.status(200).json({
    success: true,
    message: "Designation Deleted Success..!",
  });
}

module.exports = {
  addDesignation,
  getAllDesignation,
  updateDesignation,
  deleteDesignation,
};
