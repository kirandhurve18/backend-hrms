const timesheetController = require("../controllers/timesheet.controller");

const router = require("express").Router();


// POST apply for leave
router.post("/add_timesheet", timesheetController.addWorkReport);
router.post("/get_timesheet", timesheetController.getWorkReport);
router.post("/get_timesheet_status_by_employee", timesheetController.getTimesheetStatusByEmployee);
router.post("/get_timesheet_status_by_team", timesheetController.getTimesheetStatusByTeam);
router.post("/get_timesheet_status_by_date", timesheetController.getTimesheetStatusByDate);
router.post("/reassign_timesheet", timesheetController.reassignTimesheet);
router.post("/approve_timesheet", timesheetController.approveTimesheet);

module.exports = router;
