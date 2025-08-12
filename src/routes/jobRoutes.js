const express = require('express');
const router = express.Router();
const controller = require('../controllers/jobController');

router.post('/EmpjobPost', controller.createJob);            // emploer job
router.get('/getjobCan', controller.getJobs);               // All jobs (filter/search). //student get job
router.get('/:id', controller.getJobById);         // Single job

module.exports = router;
