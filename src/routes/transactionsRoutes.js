const express = require("express");
const router = express.Router();

transactionsController = require("../controllers/transactionsController");

router.get("/", transactionsController.getTransactions);
router.get("/category", transactionsController.getTransactionsByCategory);
router.get("/balance", transactionsController.getBalance);
router.get("/:id", transactionsController.getTransactionById);
router.post("/", transactionsController.createTransaction);
router.put("/:id", transactionsController.updateTransaction);
router.delete("/:id", transactionsController.deleteTransaction);
router.patch("/:id", transactionsController.patchTransaction);

module.exports = router;
