const express = require("express");
const router = express.Router();
const isAuthenticated = require("../middlewares/authMiddleware");
const { getProfile, updateProfile } = require("../controllers/profileController");
const { profileValidationRules } = require("../validators/profileValidator");
const validateRequest = require("../middlewares/validateRequest");

router.get("/me", isAuthenticated, getProfile);

router.post("/update", isAuthenticated, profileValidationRules, validateRequest, updateProfile);

module.exports = router;
