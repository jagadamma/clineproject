const express = require('express');
const router = express.Router();
const controller = require('../controllers/jobController');

router.post('/', controller.createJob);            // Admin
router.get('/', controller.getJobs);               // All jobs (filter/search)
router.get('/:id', controller.getJobById);         // Single job

module.exports = router;
