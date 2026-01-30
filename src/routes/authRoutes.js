const express = require("express");
const authController = require("../controllers/auth.controller");
const { ensureAuthenticated } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", ensureAuthenticated, authController.logout);
router.get("/me", ensureAuthenticated, authController.me);

module.exports = router;
