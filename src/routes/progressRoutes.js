const express = require("express");
const router = express.Router();
const controller = require("../controllers/progressController");


router.post("/lesson/complete", controller.markLessonCompleted);
router.get("/course-progress/:userId/:courseId", controller.getCourseProgress);


module.exports = router;
