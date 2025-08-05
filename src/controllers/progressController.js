const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// ✅ 1. Mark a lesson as completed
exports.markLessonCompleted = async (req, res) => {
    const { userId, lessonId } = req.body;

    try {
        const lesson = await prisma.lesson.findUnique({
            where: { id: lessonId },
            include: {
                module: { select: { courseId: true } }
            }
        });

        if (!lesson) {
            return res.status(404).json({ error: "Lesson not found" });
        }

        // 1. Insert or update lesson progress
        await prisma.lessonProgress.upsert({
            where: {
                userId_lessonId: {
                    userId,
                    lessonId,
                }
            },
            update: { completed: true },
            create: { userId, lessonId }
        });

        const courseId = lesson.module.courseId;

        // 2. Count total & completed lessons for this course
        const totalLessons = await prisma.lesson.count({
            where: {
                module: { courseId }
            }
        });

        const completedLessons = await prisma.lessonProgress.count({
            where: {
                userId,
                lesson: {
                    module: { courseId }
                }
            }
        });

        const percentage = totalLessons === 0 ? 0 : (completedLessons / totalLessons) * 100;

        // 3. If completed, update Enrollment table
        if (percentage === 100) {
            await prisma.enrollment.update({
                where: {
                    userId_courseId: {
                        userId,
                        courseId
                    }
                },
                data: {
                    completed: true
                }
            });
        }

        res.status(200).json({
            message: "Lesson marked as completed",
            completedLessons,
            totalLessons,
            percentage: Math.round(percentage)
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};




// ✅ 2. Get course progress
exports.getCourseProgress = async (req, res) => {
    const userId = parseInt(req.params.userId, 10);
    const courseId = parseInt(req.params.courseId, 10);

    try {
        const totalLessons = await prisma.lesson.count({
            where: {
                module: { courseId }
            }
        });

        const completedLessons = await prisma.lessonProgress.count({
            where: {
                userId,
                lesson: {
                    module: { courseId }
                }
            }
        });

        const percentage = totalLessons === 0 ? 0 : Math.round((completedLessons / totalLessons) * 100);

        const enrollment = await prisma.enrollment.findUnique({
            where: {
                userId_courseId: {
                    userId,
                    courseId
                }
            }
        });

        res.json({
            userId,
            courseId,
            totalLessons,
            completedLessons,
            progressPercent: percentage,
            isCompleted: enrollment?.completed ?? false
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};