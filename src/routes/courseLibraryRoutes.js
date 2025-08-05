const express = require('express');
const router = express.Router();
const courseLibraryController = require('../controllers/courseLibraryController');

// Course Library routes
router.get('/courses', courseLibraryController.getFilteredCourses);
router.get('/courses/:id', courseLibraryController.getCourseDetail);
router.post('/cart/add', courseLibraryController.addToCart);
router.post('/cart/buy', courseLibraryController.buyNow);

module.exports = router;
