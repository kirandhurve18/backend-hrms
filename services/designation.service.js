const designationModel = require('../models/designation.model');

async function addDesignation(data){
    const result = await designationModel.insertMany(data);
    return result;
}

async function getAllDesignation(){
    const result = await designationModel.find();
    // const result = await departmentModel.deleteMany();
    return result;
}
async function getAllDesignationByDepartment(data){
    const result = await designationModel.find(data);
    // const result = await departmentModel.deleteMany();
    return result;
}

async function updateDesignation(query, updateData){
    // const result = await departmentModel.find();
    const result = await designationModel.updateOne(query, updateData);
    return result;
}

async function deleteDesignation(data){
    // const result = await departmentModel.find();
    const result = await designationModel.deleteOne(data);
    return result;
}

module.exports = {
    addDesignation,
    getAllDesignation,
    updateDesignation,
    deleteDesignation,
    getAllDesignationByDepartment,
}
