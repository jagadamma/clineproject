// src/routes/education.routes.js
const express = require('express');
const ctrl = require('../controllers/education.controller');
const router = express.Router();

// Create
router.post('/educations', ctrl.createEducation);

// Read (all for a user)
router.get('/users/:userId/educations', ctrl.getEducationsByUser);

// Read (single)
router.get('/educations/:id', ctrl.getEducationById);

// Update
router.patch('/educations/:id', ctrl.updateEducation);

// Delete
router.delete('/educations/:id', ctrl.deleteEducation);

module.exports = router;
