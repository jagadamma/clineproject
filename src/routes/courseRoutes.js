const express = require('express');
const router = express.Router();
const controller = require('../controllers/courseController');

router.post('/enroll', controller.enrollCourse);
router.get('/enrolled/:userId', controller.getEnrolledCourses);
router.patch('/complete', controller.completeCourse);
router.get('/:courseId', controller.getCourseDetails);
router.get('/recommend/:courseId', controller.getRecommendedCourses);

module.exports = router;
