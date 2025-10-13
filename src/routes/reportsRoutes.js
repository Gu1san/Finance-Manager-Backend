const express = require("express");
const router = express.Router();

reportsController = require("../controllers/reportsController");

router.get("/category", reportsController.getReportsByCategory);
router.get("/type", reportsController.getReportsByType);

module.exports = router;
