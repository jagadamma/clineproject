const express = require('express');

const ctrl = require('../controllers/project.controller');
const router = express.Router();

// Create
router.post('/projects', ctrl.createProject);

// Read (all for a user)
router.get('/users/:userId/projects', ctrl.getProjectsByUser);

// Read (single)
router.get('/projects/:id', ctrl.getProjectById);

// Update
router.patch('/projects/:id', ctrl.updateProject);

// Delete
router.delete('/projects/:id', ctrl.deleteProject);

module.exports = router;
