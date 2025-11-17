const express = require('express');
const router = express.Router();
const employeeController = require("../controllers/employee.controller");
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

router.post("/add_new_employee", upload.fields([
  { name: 'aadhar_card' },
  { name: 'pan_card' },
  { name: 'passport_photo' },
  { name: 'employee_sign' },
  { name: 'tenth_certificate' },
  { name: 'twelfth_certificate' },
  { name: 'graduation_certificate' },
  { name: 'resume' },
  { name: 'previous_pay_slips' },
  { name: 'previous_offer_letter' },
  { name: 'previous_experience_letter' },
  { name: 'form16' }
]), employeeController.addNewEmployee);

router.post("/upload_employee_document", upload.fields([
  { name: 'aadhar_card' },
  { name: 'pan_card' },
  { name: 'passport_photo' },
  { name: 'employee_sign' },
  { name: 'tenth_certificate' },
  { name: 'twelfth_certificate' },
  { name: 'graduation_certificate' },
  { name: 'resume' },
  { name: 'previous_pay_slips' },
  { name: 'previous_offer_letter' },
  { name: 'previous_experience_letter' },
  { name: 'form16' }
]), employeeController.uploadEmployeeDocument);

router.post("/update_employee_by_id", employeeController.updateEmployee);
router.post("/update_employee_status", employeeController.updateEmployeeStatus);
router.get("/team_hierarchy", employeeController.teamHierarchy);

router.get("/get_team_leads", employeeController.getTeamLeads);
router.get("/get_team_managers", employeeController.getTeamManagers);

router.get("/download_employee_list", employeeController.downloadEmployeeList);
router.post("/accept_rw_agreement", employeeController.acceptWRAgreement);

router.post("/update_employee_document_status", employeeController.markDocumentOrFileInactive);

router.get("/get_all_employees", employeeController.getAll);
router.get("/:id", employeeController.getById);
// router.post("/update_employee_document_status_by_id", employeeController.markDocumentOrFileInactive);

// router.post("/get_emp_on_condition", employeeController.getAllEmployeesOnCondition);
// router.post("/get_filtered_emp", employeeController.getFilteredEmployees);
// router.post("/", employeeController.create);
// router.put("/:id", employeeController.update);
// router.delete("/:id", employeeController.remove);

module.exports = router;
