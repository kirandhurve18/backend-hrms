const express = require("express");
const router = express.Router();

const hrmsController = require('../controllers/hrms.controller');
const employeeRoutes = require('./employee.route');
const dashboardRoutes = require('./dashboard.routes');
const departmentRoutes = require('../routes/department.routes');
const designationRoutes = require('../routes/designation.routes');
const subDesignation = require('../routes/subDesignation.routes');
const adminSettingsRoute = require('../routes/adminSettings.routes');
const recognitionRoutes = require('../routes/recognition.routes');
const leaveRoutes = require("../routes/leave.routes");
const attendanceRoutes = require("../routes/attendance.routes");
const timesheetRoutes = require("../routes/timesheet.routes");

// profile Api routes
router.post('/login', hrmsController.login);
router.post('/logout', hrmsController.logout);
router.get('/festival_leaves', hrmsController.festivaLeaves);
router.post('/add_festival_leaves', hrmsController.addFestivaLeaves);
router.post('/add_menus',hrmsController.addMenus);
router.post('/get_menus',hrmsController.getMenus);
router.use('/employee', employeeRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/department', departmentRoutes);
router.use('/designation', designationRoutes);
router.use('/sub_designation', subDesignation);
router.use('/admin_settings', adminSettingsRoute);
router.use('/recogmition', recognitionRoutes);
router.use('/leave', leaveRoutes);
router.use('/attendance', attendanceRoutes);
router.use('/timesheet', timesheetRoutes );

// router.get("/file/:key(*)", hrmsController.getDocuments);
router.get("/file", hrmsController.getDocuments);

module.exports = router;
