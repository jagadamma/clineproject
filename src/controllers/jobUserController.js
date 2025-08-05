const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ✅ 1. Save / Unsave Job (Toggle)
exports.toggleSaveJob = async (req, res) => {
    const { userId, jobId } = req.body;

    try {
        const exists = await prisma.savedJob.findUnique({
            where: { userId_jobId: { userId, jobId } },
        });

        if (exists) {
            await prisma.savedJob.delete({
                where: { userId_jobId: { userId, jobId } },
            });
            return res.json({ message: 'Job unsaved' });
        }

        await prisma.savedJob.create({ data: { userId, jobId } });
        res.status(201).json({ message: 'Job saved successfully' });

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// ✅ 2. Get Saved Jobs
exports.getSavedJobs = async (req, res) => {
    const userId = parseInt(req.params.userId, 10);

    try {
        const savedJobs = await prisma.savedJob.findMany({
            where: { userId },
            include: {
                job: true
            },
        });
        res.json(savedJobs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ✅ 3. Apply to Job
exports.applyToJob = async (req, res) => {
    const { userId, jobId } = req.body;

    try {
        const alreadyApplied = await prisma.jobApplication.findUnique({
            where: {
                userId_jobId: {
                    userId: parseInt(userId),
                    jobId: parseInt(jobId),
                },
            },
        });

        if (alreadyApplied) {
            return res.status(400).json({ error: 'Already applied to this job' });
        }

        const application = await prisma.jobApplication.create({
            data: {
                userId: parseInt(userId),
                jobId: parseInt(jobId),
                status: "Applied"
            },
        });

        res.status(201).json({ message: 'Job application submitted', application });

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// ✅ 4. Get Applied Jobs
exports.getAppliedJobs = async (req, res) => {
    const userId = parseInt(req.params.userId, 10);

    try {
        const applications = await prisma.jobApplication.findMany({
            where: { userId },
            include: {
                job: true
            },
        });

        res.json(applications);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
