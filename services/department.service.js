const departmentModel = require('../models/department.model');

async function addDepartment(data){

    const result = await departmentModel.insertMany(data);
    return result;
}

async function getAllDepartments(){
    const result = await departmentModel.find();
    // const result = await departmentModel.deleteMany();
    return result;
}

async function getDepartmentById(_id){
    const result = await departmentModel.findById(_id, {_id: 1, department_name: 1, department_slug: 1, status: 1, });
    // const result = await departmentModel.deleteMany();
    return result;
}

async function updateDepartments(query, updateData){
    // const result = await departmentModel.find();
    const result = await departmentModel.updateOne(query, updateData);
    return result;
}

// async function deleteDepartments(data){
//     // const result = await departmentModel.find();
//     const result = await departmentModel.deleteOne(data);
//     return result;
// }

module.exports = {
    addDepartment,
    getAllDepartments,
    updateDepartments,
    // deleteDepartments,
    getDepartmentById,
}
