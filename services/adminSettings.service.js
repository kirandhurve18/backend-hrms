const roleModel = require("../models/role.model");
const LeaveAndServiceModel = require("../models/leaveAndService.model");
const weekOffSetupmodel = require("../models/weekOffSetup.model");
const shiftTimingsModel = require("../models/shiftTimings.model");
const incomeComponentsModel = require("../models/incomeComponents.model");
const deductionComponentsModel = require("../models/deductionComponent.model");

async function addRoles (data){
    const result = await roleModel.insertMany(data);
    return result;
}

async function getAllRoles (){
    const result = await roleModel.find();
    return result;
}

async function updateRoles (query, updateData){
    const result = await roleModel.updateOne(query, updateData);
    return result;
}

async function deleteRoles (query){
    const result = await roleModel.deleteOne(query);
    return result;
}

async function addLeaveAndService (data){
    const result = await LeaveAndServiceModel.insertMany(data);
    return result;
}

async function getAllLeaveAndService (){
    const result = await LeaveAndServiceModel.find();
    return result;
}

async function updateLeaveAndService (query, updateData){
    const result = await LeaveAndServiceModel.updateOne(query, updateData);
    return result;
}

async function deleteLeaveAndService (query){
    const result = await LeaveAndServiceModel.deleteOne(query);
    return result;
}

async function addWeekOffSetup (data){
    const result = await weekOffSetupmodel.insertMany(data);
    return result;
}

async function getAllWeekOffSetup (){
    const result = await weekOffSetupmodel.find();
    return result;
}

async function updateWeekOffSetup (query, updateData){
    const result = await weekOffSetupmodel.updateOne(query, updateData);
    return result;
}

async function deleteWeekOffSetup (query){
    const result = await weekOffSetupmodel.deleteOne(query);
    return result;
}

async function addShiftTimings (data){
    const result = await shiftTimingsModel.insertMany(data);
    return result;
}

async function getAllShiftTimings (){
    const result = await shiftTimingsModel.find();
    return result;
}

async function updateShiftTimings (query, updateData){
    const result = await shiftTimingsModel.updateOne(query, updateData);
    return result;
}

async function deleteShiftTimings (query){
    const result = await shiftTimingsModel.deleteOne(query);
    return result;
}

async function addIncomeComponents (data){
    const result = await incomeComponentsModel.insertMany(data);
    return result;
}

async function getAllIncomeComponents (){
    const result = await incomeComponentsModel.find();
    return result;
}

async function updateIncomeComponents (query, updateData){
    const result = await incomeComponentsModel.updateOne(query, updateData);
    return result;
}

async function deleteIncomeComponents (query){
    const result = await incomeComponentsModel.deleteOne(query);
    return result;
}

async function addDeductionComponents (data){
    const result = await deductionComponentsModel.insertMany(data);
    return result;
}

async function getAllDeductionComponents (){
    const result = await deductionComponentsModel.find();
    return result;
}

async function updateDeductionComponents (query, updateData){
    const result = await deductionComponentsModel.updateOne(query, updateData);
    return result;
}

async function deleteDeductionComponents (query){
    const result = await deductionComponentsModel.deleteOne(query);
    return result;
}

module.exports = {
    addRoles,
    getAllRoles,
    updateRoles,
    deleteRoles,
    addLeaveAndService,
    getAllLeaveAndService,
    updateLeaveAndService,
    deleteLeaveAndService,
    addWeekOffSetup,
    getAllWeekOffSetup,
    updateWeekOffSetup,
    deleteWeekOffSetup,
    addShiftTimings,
    getAllShiftTimings,
    updateShiftTimings,
    deleteShiftTimings,
    addIncomeComponents,
    getAllIncomeComponents,
    updateIncomeComponents,
    deleteIncomeComponents,
    addDeductionComponents,
    getAllDeductionComponents,
    updateDeductionComponents,
    deleteDeductionComponents,
}