const express = require('express');
const router = express.Router();
const controller = require('../controllers/jobController');

router.post('/', controller.createJob);            // emploer job
router.get('/', controller.getJobs);               // All jobs (filter/search). //student get job
router.get('/:id', controller.getJobById);         // Single job

module.exports = router;
