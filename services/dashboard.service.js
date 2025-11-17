const employee = require('../models/employee.model');
const role = require('../models/role.model');

async function findOneEmployee(data) {
    const employeeResult = await employee.findOne(data);
    return employeeResult;
};

module.exports = {
    findOneEmployee,
}