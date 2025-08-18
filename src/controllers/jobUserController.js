// const { PrismaClient } = require('@prisma/client');
// const prisma = new PrismaClient();

// // ✅ 1. Save / Unsave Job (Toggle)
// exports.toggleSaveJob = async (req, res) => {
//     const { userId, jobId } = req.body;

//     try {
//         const exists = await prisma.savedJob.findUnique({
//             where: { userId_jobId: { userId, jobId } },
//         });

//         if (exists) {
//             await prisma.savedJob.delete({
//                 where: { userId_jobId: { userId, jobId } },
//             });
//             return res.json({ message: 'Job unsaved' });
//         }

//         await prisma.savedJob.create({ data: { userId, jobId } });
//         res.status(201).json({ message: 'Job saved successfully' });

//     } catch (err) {
//         res.status(400).json({ error: err.message });
//     }
// };

// // ✅ 2. Get Saved Jobs
// exports.getSavedJobs = async (req, res) => {
//     const userId = parseInt(req.params.userId, 10);

//     try {
//         const savedJobs = await prisma.savedJob.findMany({
//             where: { userId },
//             include: {
//                 job: true
//             },
//         });
//         res.json(savedJobs);
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// };

// // ✅ 3. Apply to Job
// exports.applyToJob = async (req, res) => {
//     const { userId, jobId } = req.body;

//     try {
//         const alreadyApplied = await prisma.jobApplication.findUnique({
//             where: {
//                 userId_jobId: {
//                     userId: parseInt(userId),
//                     jobId: parseInt(jobId),
//                 },
//             },
//         });

//         if (alreadyApplied) {
//             return res.status(400).json({ error: 'Already applied to this job' });
//         }

//         const application = await prisma.jobApplication.create({
//             data: {
//                 userId: parseInt(userId),
//                 jobId: parseInt(jobId),
//                 status: "Applied"
//             },
//         });

//         res.status(201).json({ message: 'Job application submitted', application });

//     } catch (err) {
//         res.status(400).json({ error: err.message });
//     }
// };

// // ✅ 4. Get Applied Jobs
// exports.getAppliedJobs = async (req, res) => {
//     const userId = parseInt(req.params.userId, 10);

//     try {
//         const applications = await prisma.jobApplication.findMany({
//             where: { userId },
//             include: {
//                 job: true
//             },
//         });

//         res.json(applications);
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// };



const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
exports.applyJob = async (req, res) => {
    try {
        // :white_check_mark: JWT मधून user id आलंय, आता DB मध्ये check करू
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: { id: true, isStudent: true }
        });
        if (!user || !user.isStudent) {
            return res.status(403).json({ message: "Only students can apply" });
        }
        const { jobId } = req.body;
        // Prevent duplicate applications
        const existing = await prisma.jobApplication.findUnique({
            where: { userId_jobId: { userId: user.id, jobId: parseInt(jobId) } }
        });
        if (existing) {
            return res.status(400).json({ message: "Already applied" });
        }
        //  Create application
        const application = await prisma.jobApplication.create({
            data: {
                userId: user.id,
                jobId: parseInt(jobId),
                status: "Applied"
            }
        });
        res.status(201).json({ message: "Applied successfully", application });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};