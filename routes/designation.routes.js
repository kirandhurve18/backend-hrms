const designationController = require('../controllers/designation.controller');
const express = require("express");
const router = express.Router();

router.post('/add_designation', designationController.addDesignation);
router.get('/get_all_designation', designationController.getAllDesignation);
router.post('/update_designation', designationController.updateDesignation);
router.post('/delete_designation', designationController.deleteDesignation);

module.exports = router;
