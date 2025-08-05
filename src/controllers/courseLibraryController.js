const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 🎯 GET /api/courses - Filter + List courses
exports.getFilteredCourses = async (req, res) => {
    try {
        const { category, language, durationMin, durationMax } = req.query;

        const filters = {};
        if (category) filters.category = category;
        if (language) filters.language = language;
        if (durationMin && durationMax) {
            filters.duration = {
                gte: parseInt(durationMin),
                lte: parseInt(durationMax),
            };
        }

        const courses = await prisma.course.findMany({
            where: filters,
            include: { enrollments: true },
        });

        res.json(courses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 🎯 GET /api/courses/:id - Course detail
exports.getCourseDetail = async (req, res) => {
    try {
        const course = await prisma.course.findUnique({
            where: { id: parseInt(req.params.id) },
            include: {
                modules: {
                    include: { lessons: true },
                },
            },
        });

        if (!course) return res.status(404).json({ error: 'Course not found' });
        res.json(course);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 🎯 POST /api/cart/add - Add course to cart
exports.addToCart = async (req, res) => {
    const { userId, courseId } = req.body;

    try {
        const existing = await prisma.cart.findFirst({
            where: { userId, courseId },
        });

        if (existing) return res.status(400).json({ error: 'Already in cart' });

        const cart = await prisma.cart.create({
            data: { userId, courseId },
        });

        res.status(201).json(cart);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 🎯 POST /api/cart/buy - Buy course now
exports.buyNow = async (req, res) => {
    const { userId, courseId } = req.body;

    try {
        const enrollment = await prisma.enrollment.create({
            data: {
                userId,
                courseId,
                completed: false,
                durationSpent: 0,
            },
        });

        // Optionally remove from cart
        await prisma.cart.deleteMany({ where: { userId, courseId } });

        res.status(201).json({ message: 'Course enrolled successfully', enrollment });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
