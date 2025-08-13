// controllers/userFullController.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// GET /api/users/:id/full  -> single user's full snapshot
exports.getUserFull = async (req, res) => {
    try {
        const idNum = Number(req.params.id);
        if (!Number.isFinite(idNum) || idNum <= 0) {
            return res.status(400).json({ message: "Invalid user id" });
        }

        const user = await prisma.user.findUnique({
            where: { id: idNum },
            select: {
                id: true,
                first_name: true,
                last_name: true,
                email: true,
                phone: true,
                isStudent: true,
                created_at: true,
                updated_at: true,

                // 1:1
                profile: true,             // UserProfile
                // 1:n lists with sensible ordering
                educations: {
                    orderBy: { startDate: "desc" },
                },
                projects: {
                    orderBy: { createdAt: "desc" },
                },
                workExperiences: {
                    orderBy: { startDate: "desc" },
                },
            },
        });

        if (!user) return res.status(404).json({ message: "User not found" });
        return res.json({ user });
    } catch (err) {
        console.error("getUserFull error:", err);
        return res.status(500).json({ message: "Server error" });
    }
};

// (Optional) GET /api/users/full?limit=50&offset=0  -> many users + all nested
// Heavy query: keep paginated!
exports.listUsersFull = async (req, res) => {
    try {
        const limit = Math.min(Number(req.query.limit) || 10, 100);
        const offset = Number(req.query.offset) || 0;

        const [count, users] = await Promise.all([
            prisma.user.count(),
            prisma.user.findMany({
                skip: offset,
                take: limit,
                orderBy: { created_at: "desc" },
                select: {
                    id: true,
                    first_name: true,
                    last_name: true,
                    email: true,
                    phone: true,
                    isStudent: true,
                    created_at: true,
                    updated_at: true,
                    profile: true,
                    educations: { orderBy: { startDate: "desc" } },
                    projects: { orderBy: { createdAt: "desc" } },
                    workExperiences: { orderBy: { startDate: "desc" } },
                },
            }),
        ]);

        return res.json({ count, limit, offset, users });
    } catch (err) {
        console.error("listUsersFull error:", err);
        return res.status(500).json({ message: "Server error" });
    }
};
