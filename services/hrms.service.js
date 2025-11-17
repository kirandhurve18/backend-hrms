const employee = require('../models/employee.model');
const festivalLeaveModel = require('../models/festivalLeave.model');
const role = require('../models/role.model');
const menuModel = require('../models/menuModel');

async function findOneEmployee(data) {
    const employeeResult = await employee.findOne(data);
    return employeeResult;
};

async function findOneRole(data) {
    const roleResult = await role.findOne(data);
    return roleResult;
};

async function getAllFestivalLeaves(){
    const festivaLeaves = await festivalLeaveModel.find();
    return festivaLeaves;
}

async function insertFestivalLeaves(data){
    const result = await festivalLeaveModel.insertMany(data);
    return result;
}

async function insertMenus(data){
    const result = await menuModel.insertMany(data);
    return result;
}

async function getMenus(data){
    const result = await menuModel.find(data, {category: 0, __v: 0, is_active: 0 });
    return result;
}

module.exports = {
    findOneEmployee,
    findOneRole,
    getAllFestivalLeaves,
    insertMenus,
    getMenus,
    insertFestivalLeaves,
}