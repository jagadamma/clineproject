const express = require("express");
const router = express.Router();
const controller = require("../controllers/dashboardController");

router.get("/:userId", controller.getStudentDashboard);

module.exports = router;
