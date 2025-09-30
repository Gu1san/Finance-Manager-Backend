const express = require("express");
const router = express.Router();

filesController = require("../controllers/filesController");

const upload = require("../middlewares/upload");

router.post(
  "/import",
  upload.single("file"),
  filesController.importTransactions
);

router.get("/export", filesController.exportTransactions);

module.exports = router;
