const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getStudentDashboard = async (req, res) => {
    const userId = parseInt(req.params.userId, 10);

    try {
        // 1. Count enrolled courses
        const totalEnrolled = await prisma.enrollment.count({
            where: { userId },
        });

        // 2. Count completed courses
        const totalCompleted = await prisma.enrollment.count({
            where: {
                userId,
                completed: true,
            },
        });

        // 3. Total lessons completed
        const completedLessons = await prisma.lessonProgress.count({
            where: { userId },
        });

        // 4. Total lessons available across all enrolled courses
        const enrolledCourses = await prisma.enrollment.findMany({
            where: { userId },
            select: {
                courseId: true,
            },
        });

        const courseIds = enrolledCourses.map(e => e.courseId);

        const totalLessons = await prisma.lesson.count({
            where: {
                module: {
                    courseId: { in: courseIds }
                }
            }
        });

        const overallProgress = totalLessons === 0
            ? 0
            : Math.round((completedLessons / totalLessons) * 100);

        res.json({
            userId,
            totalEnrolledCourses: totalEnrolled,
            totalCompletedCourses: totalCompleted,
            completedLessons,
            totalLessons,
            overallProgressPercent: overallProgress,
            currentScore: 0 // Placeholder for future analytics
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong" });
    }
};
