const departmentController = require('../controllers/department.controller');
const express = require("express");
const router = express.Router();

router.post('/add_department', departmentController.addDepartment);
router.get('/get_all_departments', departmentController.getAllDepartments);
router.get('/get_departments/:_id', departmentController.getDepartmentById);
router.post('/update_department', departmentController.updateDepartments);
// router.post('/delete_department', departmentController.deleteDepartments);

module.exports = router;
