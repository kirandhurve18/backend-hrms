const router = require("express").Router();
const leaveController = require("../controllers/leave.controller");

// POST apply for leave
router.post("/leave_apply", leaveController.applyLeave);
// GET all leave applications
router.post("/leave_applications", leaveController.getAllLeaves);
module.exports = router;
