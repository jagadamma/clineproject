// const express = require('express');
// const router = express.Router();
// const controller = require('../controllers/jobController');

// router.post('/', controller.createJob);            // emploer job
// router.get('/', controller.getJobs);               // All jobs (filter/search). //student get job
// router.get('/:id', controller.getJobById);         // Single job

// module.exports = router;


// routes/jobRoutes.js
const express = require("express");
const router = express.Router();
const isAuthenticated = require("../middlewares/authMiddleware");
const jobCandidateController = require("../controllers/jobController");
// Employer
router.post("/", isAuthenticated, jobCandidateController.createJob);
router.put("/:id", isAuthenticated, jobCandidateController.updateJob);
router.delete("/:id", isAuthenticated, jobCandidateController.deleteJob);
router.get("/employer", isAuthenticated, jobCandidateController.getEmployerJobsWithApplicants);
// Student
router.get("/", isAuthenticated, jobCandidateController.getAllJobs);
module.exports = router;
