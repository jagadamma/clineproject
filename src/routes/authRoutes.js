const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { signupValidationRules, loginValidationRules } = require("../validators/authValidator");
const validateRequest = require("../middlewares/validateRequest");

router.post("/signup", signupValidationRules, validateRequest, authController.signup);
router.post("/login", loginValidationRules, validateRequest, authController.login);
router.post("/social-login", authController.socialLogin);

module.exports = router;
