const express = require("express");
const router = express.Router();

const reportsController = require("../controllers/reportsController");
const { ensureAuthenticated } = require("../middlewares/authMiddleware");

router.use(ensureAuthenticated);

router.get("/category", reportsController.getReportsByCategory);
router.get("/type", reportsController.getReportsByType);

module.exports = router;
