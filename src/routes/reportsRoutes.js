const express = require("express");
const router = express.Router();

const reportsController = require("../controllers/reportsController");
const { ensureAuthenticated } = require("../middlewares/authMiddleware");

router.use(ensureAuthenticated);

router.get("/summary", reportsController.getSummary);

router.get("/expenses-by-category", reportsController.getExpensesByCategory);

router.get("/income-by-category", reportsController.getIncomeByCategory);

router.get("/balance-evolution", reportsController.getBalanceEvolution);

module.exports = router;
