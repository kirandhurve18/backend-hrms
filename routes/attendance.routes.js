const router = require("express").Router();
const attandanceControllers = require("../controllers/attendance.controller");


// POST apply for leave
router.post("/checkIn", attandanceControllers.checkIn);
router.post("/checkOut", attandanceControllers.checkOut);
router.post("/get_attendance", attandanceControllers.getAttendance);
router.post("/get_monthly_attendance", attandanceControllers.getMonthlyEmployeeStatus);
router.post("/get_attendance_summary", attandanceControllers.getAttendanceSummary);
router.post("/get_monthly_late_commers", attandanceControllers.getMonthlyLateCommers);
router.get("/get_present_employee_list", attandanceControllers.getPresentEmployeeList);
router.get("/get_employee_attendance_report", attandanceControllers.getEmployeeAttendanceReport);
router.post("/update_present_employee_status", attandanceControllers.updatePresentEmployeeStatus);

module.exports = router;
