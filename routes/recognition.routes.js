const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() }); // Store files in memory
const recognitionController = require("../controllers/recognition.controller.js");

// GET all recognition records
router.get("/current_winners", recognitionController.getAllRecognition);

// GET all employees for selecting employee in dropdown
router.get("/employees", recognitionController.getAllEmployees);

// GET award winners by year and award type
router.post("/winners_by_year", recognitionController.getAwardWinnersByYear);

//GET award winners by month
router.post("/winners_by_month", recognitionController.getAwardWinnersByMonth);

// POST add new recognized employee
router.post(
  "/add_winner",
  upload.array("awarded_pics"),
  recognitionController.addRecognizedEmployee
);

module.exports = router;
