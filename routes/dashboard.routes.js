const express = require('express');
const router = express.Router();
const dashboardController = require("../controllers/dashboard.controller");
const middleware = require("../controllers/middleware.controller");

router.post("/attendance_summary_count", middleware.protect, middleware.checkSuperAdminAccess, dashboardController.attendanceSummaryCount);
router.post("/employees_on_leave_today", middleware.protect, middleware.checkAdminAccess, dashboardController.EmployeesOnLeaveToday);
router.post("/upcomming_birthday", middleware.protect, middleware.checkSuperAdminAccess, dashboardController.upcommingBirthday);
router.post("/approval_pendings", middleware.protect, middleware.checkAdminAccess, dashboardController.approvalPendings);
// router.post("/my_tasks", middleware.protect, middleware.checkUserAccess, dashboardController.myTasks);
router.post("/get_tasks", middleware.protect, dashboardController.getTasks);
router.post("/add_task", middleware.protect, middleware.checkUserAccess, dashboardController.addTask);
router.post("/update_task", middleware.protect, middleware.checkUserAccess, dashboardController.updateTask);
router.post("/delete_task", middleware.protect, middleware.checkUserAccess, dashboardController.deleteTask);

module.exports = router;
