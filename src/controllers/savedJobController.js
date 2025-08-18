// controllers/savedJobController.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
// Save a job (student only)
exports.saveJob = async (req, res) => {
    try {
        if (!req.user.isStudent) {
            return res.status(403).json({ message: "Only students can save jobs" });
        }
        const { jobId } = req.body;
        const existing = await prisma.savedJob.findUnique({
            where: { userId_jobId: { userId: req.user.id, jobId } }
        });
        if (existing) {
            return res.status(400).json({ message: "Already saved" });
        }
        const saved = await prisma.savedJob.create({
            data: { userId: req.user.id, jobId }
        });
        res.status(201).json({ message: "Job saved", saved });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};
// Get saved jobs of logged-in student
exports.getSavedJobs = async (req, res) => {
    try {
        if (!req.user.isStudent) {
            return res.status(403).json({ message: "Only students can view saved jobs" });
        }
        const savedJobs = await prisma.savedJob.findMany({
            where: { userId: req.user.id },
            include: {
                job: true
            }
        });
        res.json(savedJobs);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};
// Unsave job
exports.unsaveJob = async (req, res) => {
    try {
        const { jobId } = req.params;
        const existing = await prisma.savedJob.findUnique({
            where: { userId_jobId: { userId: req.user.id, jobId: Number(jobId) } }
        });
        if (!existing) {
            return res.status(404).json({ message: "Job not saved" });
        }
        await prisma.savedJob.delete({
            where: { userId_jobId: { userId: req.user.id, jobId: Number(jobId) } }
        });
        res.json({ message: "Job unsaved" });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};