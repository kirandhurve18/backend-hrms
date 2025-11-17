const subdesignationModel = require('../models/subDesignation.model');

async function addSubDesignation(data){
    const result = await subdesignationModel.insertMany(data);
    return result;
}

async function getAllSubDesignation(){
    const result = await subdesignationModel.find();
    // const result = await departmentModel.deleteMany();
    return result;
}

async function updateSubDesignation(query, updateData){
    // const result = await departmentModel.find();
    const result = await subdesignationModel.updateOne(query, updateData);
    return result;
}

async function deleteSubDesignation(data){
    // const result = await departmentModel.find();
    const result = await subdesignationModel.deleteOne(data);
    return result;
}

module.exports = {
    addSubDesignation,
    getAllSubDesignation,
    updateSubDesignation,
    deleteSubDesignation,
}
