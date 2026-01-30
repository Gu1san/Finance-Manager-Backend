const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../middlewares/authMiddleware");

const transactionsController = require("../controllers/transactionsController");

router.use(ensureAuthenticated);

router.get("/", transactionsController.getTransactions);
router.get("/category", transactionsController.getTransactionsByCategory);
router.get("/type", transactionsController.getTransactionsByType);
router.get("/balance", transactionsController.getBalance);
router.get("/balance/categories", transactionsController.getBalanceByCategory);
router.get("/:id", transactionsController.getTransactionById);
router.post("/", transactionsController.createTransaction);
router.put("/:id", transactionsController.updateTransaction);
router.delete("/:id", transactionsController.deleteTransaction);
router.patch("/:id", transactionsController.patchTransaction);

module.exports = router;
