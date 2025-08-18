const express = require("express");
const {
    getJobApplicants,
    getApplicantProfile,
} = require("../controllers/employerController");
const isAuthenticated = require("../middlewares/authMiddleware");
const router = express.Router();
// :pushpin: Get applicants list (with pagination)
router.get("/employer/jobs/:jobId/applicants", isAuthenticated, getJobApplicants);
// :pushpin: Get full applicant profile
router.get("/employer/applicant/:userId", isAuthenticated, getApplicantProfile);
module.exports = router;