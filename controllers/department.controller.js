const departmentService = require("../services/department.service");

// async function addDepartment(req,res){
//     let reqData = req.body;
//     reqData = reqData.map((item) => {
//         return {
//             ...item,
//             status: item.status == 'active' ? 1 : 0
//         }
//     })
//     const data = await departmentService.addDepartment(reqData);
//     return res.status(200).json({
//         success: true,
//         message: "Department Added Success..!"
//     });
// }

async function addDepartment(req, res) {
  let reqData = req.body.departments;

  reqData = reqData.map((item) => {
    return {
      department_name: item.name,
      status: item.status === 'active' ? 1 : 0
      // department_slug will be auto-generated in schema pre-hook
    };
  });

  await departmentService.addDepartment(reqData);

  return res.status(200).json({
    success: true,
    message: "Departments Added Successfully..!"
  });
}


async function getAllDepartments(req, res) {
  try {
    const data = await departmentService.getAllDepartments();

    // const updatedData = data.map(item => {
    //   const obj = item.toObject();

    //   return {
    //     _id: obj._id, // expose as `id` instead of `_id`
    //     name: obj.department_name,
    //     slug: obj.department_slug,
    //     status: obj.status === 1 ? "Active" : "Inactive",
    //     createdAt: obj.createdAt,
    //     updatedAt: obj.updatedAt
    //   };
    // });

    return res.status(200).json({
      success: true,
      message: "Departments Fetched Successfully..!",
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch departments",
      error: error.message
    });
  }
}

async function getDepartmentById(req, res) {
  const _id = req.params._id;

  try {
    const data = await departmentService.getDepartmentById(_id);

    return res.status(200).json({
      success: true,
      message: "Department Fetched Successfully..!",
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch departments",
      error: error.message
    });
  }
}

async function updateDepartments(req,res){
    const id = req.body.dept_id;
    const status = req.body.status == 'active' ? 1 : 0;
    const query = {
        _id: id
    }
    const updateData = {
        $set: { status: status }
    }
    const data = await departmentService.updateDepartments(query, updateData);
    return res.status(200).json({
        success: true,
        message: "Department Updated Success..!"
    });
}

// async function deleteDepartments(req,res){
//     const id = req.body.dept_id;
//     const query = {
//         _id: id
//     }
//     const data = await departmentService.deleteDepartments(query);
//     return res.status(200).json({
//         success: true,
//         message: "Department Deleted Success..!"
//     });
// }

module.exports = {
    addDepartment,
    getAllDepartments,
    updateDepartments,
    getDepartmentById,
    // deleteDepartments,
}