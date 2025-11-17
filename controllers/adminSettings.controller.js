const roleModel = require("../models/role.model");
const adminSettingsService = require("../services/adminSettings.service");
const slugify = require("slugify");

// async function addRoles(req, res){
//     const roles = req.body.roles;
//     // console.log("roles-->",roles);
//     const result = await adminSettingsService.addRoles(roles);

//     return res.status(200).json({
//         message: "Roles Added Successfully..!",
//         success: true
//     })
// }

// controller/roleController.js
async function addRoles(req, res) {
  try {
    const { roles } = req.body;

    if (!roles || !Array.isArray(roles) || roles.length === 0) {
      return res.status(400).json({
        message: "Roles array is required",
        success: false,
      });
    }

    const results = [];

    for (const role of roles) {
      const { role_name, description, permissions, is_active } = role;

      if (!role_name) {
        return res.status(400).json({
          message: "Each role must have role_name",
          success: false,
        });
      }

      // Generate slug from role_name
      const role_slug = slugify(role_name, { lower: true, strict: true });

      // ❌ Check if role already exists
      const existing = await roleModel.findOne({ role_slug });
      if (existing) {
        return res.status(409).json({
          message: `Role with slug '${role_slug}' already exists`,
          success: false,
        });
      }

      // ✅ Create new role
      const newRole = new roleModel({
        role_name,
        role_slug,
        description,
        permissions,
        is_active,
      });

      await newRole.save();
      results.push(newRole);
    }

    return res.status(201).json({
      message: "Roles Added Successfully..!",
      success: true,
      //   data: results
    });
  } catch (error) {
    console.error("Error in addRoles:", error);
    return res.status(500).json({
      message: "Something went wrong",
      success: false,
      error: error.message,
    });
  }
}

// async function updateRoles(req, res) {
//   const id = req.body.id;
//   const role_name = req.body.role_name;
//   const description = req.body.description || "";
//   const department_id = req.body.department_id;
//   const permissions = req.body.permissions;
//   const is_active = req.body.is_active;

//   const query = {
//     _id: id,
//   };
//   const updateData = {
//     $set: {
//       role_name: role_name,
//       description: description,
//       department_id: department_id,
//       permissions: permissions,
//       is_active: is_active,
//     },
//   };
//   const result = await adminSettingsService.updateRoles(query, updateData);

//   return res.status(200).json({
//     message: "Roles Updated Successfully..!",
//     success: true,
//   });
// }

async function updateRole(req, res) {
  try {
    const { _id, role_name, description, permissions, is_active } = req.body;

    if (!_id) {
      return res.status(400).json({
        message: "Role id is required",
        success: false,
      });
    }

    const role = await roleModel.findById(_id);
    if (!role) {
      return res.status(404).json({
        message: "Role not found",
        success: false,
      });
    }

    // Update fields if provided
    if (role_name) {
      role.role_name = role_name;
      role.role_slug = slugify(role_name, { lower: true, strict: true });
    }

    if (description !== undefined) role.description = description;
    if (permissions !== undefined) role.permissions = permissions;
    if (is_active !== undefined) role.is_active = is_active;

    await role.save();

    return res.status(200).json({
      message: "Role Updated Successfully..!",
      success: true,
      // data: role
    });
  } catch (error) {
    console.error("Error in updateRoles:", error);
    return res.status(500).json({
      message: "Something went wrong",
      success: false,
      error: error.message,
    });
  }
}

// async function getAllRoles(req, res) {
//   const result = await adminSettingsService.getAllRoles();

//   return res.status(200).json({
//     message: "Roles Fetched Successfully..!",
//     success: true,
//     data: result,
//   });
// }

async function getAllRoles(req, res) {
  try {
    const roles = await roleModel
      .find(
        { is_active: true },
        { __v: 0, is_active: 0, createdAt: 0, updatedAt: 0 }
      ) // only active roles
      .populate("permissions.menu", "name key") // populate only name & key
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Roles Fetched Successfully..!",
      success: true,
      data: roles,
    });
  } catch (error) {
    console.error("Error in getAllRoles:", error);
    return res.status(500).json({
      message: "Something went wrong",
      success: false,
      error: error.message,
    });
  }
}

async function getRolesList(req, res) {
  try {
    let roles = await roleModel.aggregate([
      {
        $lookup: {
          from: "employees", // 👈 ensure this matches your employee collection
          localField: "_id",
          foreignField: "role_id",
          as: "employees",
        },
      },
      {
        $addFields: {
          employeeCount: { $size: "$employees" },
        },
      },
      {
        $project: {
          __v: 0,
          createdAt: 0,
          updatedAt: 0,
          "permissions.actions": 0,
          employees: 0,
        },
      },
      { $sort: { createdAt: -1 } },
    ]);

    // populate menus (name & key only)
    roles = await roleModel.populate(roles, {
      path: "permissions.menu",
      select: "name key",
    });

    return res.status(200).json({
      success: true,
      message: "Roles list fetched successfully",
      data: roles,
    });
  } catch (error) {
    console.error("Error in getRolesList:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch roles",
      error: error.message,
    });
  }
}

async function getRoleById(req, res) {
  const _id = req.params._id;
  try {
    const role = await roleModel
      .findOne({ _id: _id }, { __v: 0, createdAt: 0 }) // only active roles
      .populate("permissions.menu", "name key"); // populate only name & key

    return res.status(200).json({
      message: "Role Fetched Successfully..!",
      success: true,
      data: role,
    });
  } catch (error) {
    console.error("Error in getAllRoles:", error);
    return res.status(500).json({
      message: "Something went wrong",
      success: false,
      error: error.message,
    });
  }
}

// async function deleteRoles(req, res) {
//   const id = req.body.id;

//   const query = {
//     _id: id,
//   };

//   const result = await adminSettingsService.deleteRoles(query);

//   return res.status(200).json({
//     message: "Roles Deleted Successfully..!",
//     success: true,
//   });
// }

async function addLeaveAndService(req, res) {
  const data = req.body.leave_service;
  //   console.log("data-->", data);
  const result = await adminSettingsService.addLeaveAndService(data);

  return res.status(200).json({
    message: "Leave And Service Added Successfully..!",
    success: true,
  });
}

async function updateLeaveAndService(req, res) {
  const id = req.body.id;
  const title = req.body.title;
  const duration = req.body.duration;

  const query = {
    _id: id,
  };
  const updateData = {
    $set: { title: title, duration: duration },
  };
  const result = await adminSettingsService.updateLeaveAndService(
    query,
    updateData
  );

  return res.status(200).json({
    message: "Leave And Services Updated Successfully..!",
    success: true,
  });
}

async function getAllLeaveAndService(req, res) {
  const result = await adminSettingsService.getAllLeaveAndService();

  return res.status(200).json({
    message: "Leave And Services Fetched Successfully..!",
    success: true,
    data: result,
  });
}

async function deleteLeaveAndService(req, res) {
  const id = req.body.id;

  const query = {
    _id: id,
  };

  const result = await adminSettingsService.deleteLeaveAndService(query);

  return res.status(200).json({
    message: "Leave And Services Deleted Successfully..!",
    success: true,
  });
}

async function addWeekOffSetup(req, res) {
  const data = req.body.week_off_setup;
  console.log("data-->", data);
  const result = await adminSettingsService.addWeekOffSetup(data);

  return res.status(200).json({
    message: "Week Off Setup Added Successfully..!",
    success: true,
  });
}

async function updateWeekOffSetup(req, res) {
  const id = req.body.id;
  const work_mode = req.body.work_mode;
  const days = req.body.days;

  const query = {
    _id: id,
  };
  const updateData = {
    $set: { work_mode: work_mode, days: days },
  };
  const result = await adminSettingsService.updateWeekOffSetup(
    query,
    updateData
  );

  return res.status(200).json({
    message: "Week Off Setup Updated Successfully..!",
    success: true,
  });
}

async function getAllWeekOffSetup(req, res) {
  const result = await adminSettingsService.getAllWeekOffSetup();

  return res.status(200).json({
    message: "Week Off Setup Fetched Successfully..!",
    success: true,
    data: result,
  });
}

async function deleteWeekOffSetup(req, res) {
  const id = req.body.id;

  const query = {
    _id: id,
  };

  const result = await adminSettingsService.deleteWeekOffSetup(query);

  return res.status(200).json({
    message: "Week Off Setup Deleted Successfully..!",
    success: true,
  });
}

async function addShiftTimings(req, res) {
  const data = req.body.shift_timings;
  console.log("data-->", data);
  const result = await adminSettingsService.addShiftTimings(data);

  return res.status(200).json({
    message: "Shift Timings Added Successfully..!",
    success: true,
  });
}

async function updateShiftTimings(req, res) {
  const id = req.body.id;
  const title = req.body.title;
  const timings = req.body.timings;

  const query = {
    _id: id,
  };
  const updateData = {
    $set: { title: title, timings: timings },
  };
  const result = await adminSettingsService.updateShiftTimings(
    query,
    updateData
  );

  return res.status(200).json({
    message: "Shift Timings Updated Successfully..!",
    success: true,
  });
}

async function getAllShiftTimings(req, res) {
  const result = await adminSettingsService.getAllShiftTimings();

  return res.status(200).json({
    message: "Shift Timings Fetched Successfully..!",
    success: true,
    data: result,
  });
}

async function deleteShiftTimings(req, res) {
  const id = req.body.id;

  const query = {
    _id: id,
  };

  const result = await adminSettingsService.deleteShiftTimings(query);

  return res.status(200).json({
    message: "Shift Timings Deleted Successfully..!",
    success: true,
  });
}

async function addIncomeComponents(req, res) {
  let data = req.body.income_components;
  console.log("data-->", data);
  data = data.map((item) => {
    return {
      ...item,
      status: item.status == "active" ? 1 : 0,
    };
  });
  const result = await adminSettingsService.addIncomeComponents(data);

  return res.status(200).json({
    message: "Income Components Added Successfully..!",
    success: true,
  });
}

async function updateIncomeComponents(req, res) {
  const id = req.body.id;
  const component = req.body.component;
  const status = req.body.status == "active" ? 1 : 0;

  const query = {
    _id: id,
  };
  const updateData = {
    $set: { component: component, status: status },
  };
  const result = await adminSettingsService.updateIncomeComponents(
    query,
    updateData
  );

  return res.status(200).json({
    message: "Income Components Updated Successfully..!",
    success: true,
  });
}

async function getAllIncomeComponents(req, res) {
  const result = await adminSettingsService.getAllIncomeComponents();
  console.log("result-->", result);
  const updatedData = result.map((item) => ({
    ...item.toObject(),
    status: item.status === 1 ? "Active" : "Inactive",
  }));
  return res.status(200).json({
    message: "Income Components Fetched Successfully..!",
    success: true,
    data: updatedData,
  });
}

async function deleteIncomeComponents(req, res) {
  const id = req.body.id;

  const query = {
    _id: id,
  };

  const result = await adminSettingsService.deleteIncomeComponents(query);

  return res.status(200).json({
    message: "Income Components Deleted Successfully..!",
    success: true,
  });
}

async function addDeductionComponents(req, res) {
  let data = req.body.deduction_components;
  console.log("data-->", data);
  data = data.map((item) => {
    return {
      ...item,
      status: item.status == "active" ? 1 : 0,
    };
  });
  const result = await adminSettingsService.addDeductionComponents(data);

  return res.status(200).json({
    message: "Deduction Components Added Successfully..!",
    success: true,
  });
}

async function updateDeductionComponents(req, res) {
  const id = req.body.id;
  const component = req.body.component;
  const status = req.body.status == "active" ? 1 : 0;

  const query = {
    _id: id,
  };
  const updateData = {
    $set: { component: component, status: status },
  };
  const result = await adminSettingsService.updateDeductionComponents(
    query,
    updateData
  );

  return res.status(200).json({
    message: "Deduction Components Updated Successfully..!",
    success: true,
  });
}

async function getAllDeductionComponents(req, res) {
  const result = await adminSettingsService.getAllDeductionComponents();
  console.log("result-->", result);
  const updatedData = result.map((item) => ({
    ...item.toObject(),
    status: item.status === 1 ? "Active" : "Inactive",
  }));
  return res.status(200).json({
    message: "Deduction Components Fetched Successfully..!",
    success: true,
    data: updatedData,
  });
}

async function deleteDeductionComponents(req, res) {
  const id = req.body.id;

  const query = {
    _id: id,
  };

  const result = await adminSettingsService.deleteDeductionComponents(query);

  return res.status(200).json({
    message: "Deduction Components Deleted Successfully..!",
    success: true,
  });
}

module.exports = {
  addRoles,
  getAllRoles,
  getRoleById,
  updateRole,
  getRolesList,
  // deleteRoles,
  addLeaveAndService,
  updateLeaveAndService,
  getAllLeaveAndService,
  deleteLeaveAndService,
  addWeekOffSetup,
  updateWeekOffSetup,
  getAllWeekOffSetup,
  deleteWeekOffSetup,
  addShiftTimings,
  updateShiftTimings,
  getAllShiftTimings,
  deleteShiftTimings,
  addIncomeComponents,
  updateIncomeComponents,
  getAllIncomeComponents,
  deleteIncomeComponents,
  addDeductionComponents,
  updateDeductionComponents,
  getAllDeductionComponents,
  deleteDeductionComponents,
};
