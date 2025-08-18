// const express = require('express');
// const router = express.Router();
// const jobUserController = require('../controllers/jobUserController');

// // POST: Save/Unsave job
// router.post('/save', jobUserController.toggleSaveJob);

// // GET: All saved jobs by user
// router.get('/saved/:userId', jobUserController.getSavedJobs);

// // POST: Apply to job
// router.post('/apply', jobUserController.applyToJob);

// // GET: All applied jobs by user
// router.get('/applied/:userId', jobUserController.getAppliedJobs);

// module.exports = router;


const express = require("express");
const isAuthenticated = require("../middlewares/authMiddleware");
const { applyJob } = require("../controllers/jobUserController");
const { saveJob, getSavedJobs, unsaveJob } = require("../controllers/savedJobController");
const router = express.Router();
// Apply
router.post("/jobs/apply", isAuthenticated, applyJob);
// Save / Get / Unsave
router.post("/jobs/save", isAuthenticated, saveJob);
router.get("/jobs/saved", isAuthenticated, getSavedJobs);
router.delete("/jobs/saved/:jobId", isAuthenticated, unsaveJob);
module.exports = router;