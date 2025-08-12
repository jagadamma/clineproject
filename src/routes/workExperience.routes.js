const express = require('express');

const ctrl = require('../controllers/workExperience.controller');
const router = express.Router();

// Create
router.post('/work-experiences', ctrl.createWorkExperience);

// Read (all for a user)
router.get('/users/:userId/work-experiences', ctrl.getWorkExperiencesByUser);

// Read (single)
router.get('/work-experiences/:id', ctrl.getWorkExperienceById);

// Update
router.patch('/work-experiences/:id', ctrl.updateWorkExperience);

// Delete
router.delete('/work-experiences/:id', ctrl.deleteWorkExperience);

module.exports = router;
