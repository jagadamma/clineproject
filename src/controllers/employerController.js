const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
// :pushpin: 1. Get Applicants List (with Pagination)
exports.getJobApplicants = async (req, res) => {
    try {
        const { jobId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        // :white_check_mark: Job belongs to this employer?
        const job = await prisma.jobPosting.findUnique({
            where: { id: Number(jobId) },
        });
        console.log("job here", job);
        if (!job) return res.status(404).json({ message: "Job not found" });
        if (job.userId !== req.user.id)
            return res.status(403).json({ message: "Not your job" });
        // :white_check_mark: Get applications with pagination
        const applications = await prisma.jobApplication.findMany({
            where: { jobId: Number(jobId) },
            skip,
            take: limit,
            include: {
                user: {
                    select: {
                        id: true,
                        first_name: true,
                        last_name: true,
                        email: true,
                    },
                },
            },
            orderBy: { appliedAt: "desc" },
        });
        console.log("application", applications)
        const total = await prisma.jobApplication.count({
            where: { jobId: Number(jobId) },
        });
        console.log("total", total);
        res.json({
            page,
            totalPages: Math.ceil(total / limit),
            totalApplicants: total,
            applicants: applications,
        });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};
// :pushpin: 2. Get Full Profile of a User
exports.getApplicantProfile = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await prisma.user.findUnique({
            where: { id: Number(userId) },
            include: {
                profile: true,
                educations: true,
                projects: true,
                workExperiences: true,
                // certificates: true,
            },
        });
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};