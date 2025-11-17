const express = require("express");
const router = express.Router();
const recognitionController = require("../controllers/recognition.controller.js");

// GET all recognition records
router.get("/current_winners", recognitionController.getAllRecognition);

// GET all employees for selecting employee in dropdown
router.get("/employees", recognitionController.getAllEmployees);

// GET award winners by year and award type
router.post("/winners_by_type", recognitionController.getAwardWinnersByYear);

// POST add new recognized employee
router.post("/add_winner", recognitionController.addRecognizedEmployee);

module.exports = router;
