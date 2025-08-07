const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.enrollCourse = async (req, res) => {
    const { userId, courseId } = req.body;
    console.log("enroll course check", req.body)
    try {
        await prisma.enrollment.create({
            data: { userId, courseId },
        });
        res.status(201).json({ message: 'Enrolled successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getEnrolledCourses = async (req, res) => {
    const userId = parseInt(req.params.userId, 10);
    try {
        const enrolled = await prisma.enrollment.findMany({
            where: { userId },
            include: { course: true },
        });
        res.json(enrolled);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.completeCourse = async (req, res) => {
    const { userId, courseId } = req.body;
    try {
        await prisma.enrollment.update({
            where: { userId_courseId: { userId, courseId } },
            data: { completed: true },
        });
        res.json({ message: 'Course marked as completed' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getCourseDetails = async (req, res) => {
    const { courseId } = req.params;
    try {
        const course = await prisma.course.findUnique({
            where: { id: parseInt(courseId) },
            include: {
                modules: {
                    include: { lessons: true },
                },
            },
        });
        res.json(course);
    } catch (err) {
        res.status(404).json({ error: 'Course not found' });
    }
};

exports.getRecommendedCourses = async (req, res) => {
    const { courseId } = req.params;
    try {
        const currentCourse = await prisma.course.findUnique({ where: { id: parseInt(courseId) } });
        const similarCourses = await prisma.course.findMany({
            where: {
                category: currentCourse.category,
                NOT: { id: parseInt(courseId) },
            },
            take: 4,
        });
        res.json(similarCourses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
