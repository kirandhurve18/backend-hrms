const subDesignationController = require('../controllers/subDesignation.controller');
const express = require("express");
const router = express.Router();

router.post('/add_subdesignation', subDesignationController.addSubDesignation);
router.get('/get_all_subdesignation', subDesignationController.getAllSubDesignation);
router.post('/update_subdesignation', subDesignationController.updateSubDesignation);
router.post('/delete_subdesignation', subDesignationController.deleteSubDesignation);

module.exports = router;
