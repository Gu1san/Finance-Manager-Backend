const express = require("express");
const { ensureAuthenticated } = require("../middlewares/authMiddleware");
const filesController = require("../controllers/filesController");

const router = express.Router();

const upload = require("../middlewares/upload");

router.use(ensureAuthenticated);

router.post(
  "/import",
  upload.single("file"),
  filesController.importTransactions,
);

router.get("/export", filesController.exportTransactions);

module.exports = router;
