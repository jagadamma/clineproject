const express = require('express');
const router = express.Router();
const jobUserController = require('../controllers/jobUserController');

// POST: Save/Unsave job
router.post('/save', jobUserController.toggleSaveJob);

// GET: All saved jobs by user
router.get('/saved/:userId', jobUserController.getSavedJobs);

// POST: Apply to job
router.post('/apply', jobUserController.applyToJob);

// GET: All applied jobs by user
router.get('/applied/:userId', jobUserController.getAppliedJobs);

module.exports = router;
