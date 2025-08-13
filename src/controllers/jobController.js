// //student sesction me job 6 me hai uska bana hai ye page-----
// const { PrismaClient } = require('@prisma/client');
// const prisma = new PrismaClient();

// // ✅ Create job (employer use)
// exports.createJob = async (req, res) => {
//     try {
//         const job = await prisma.jobPosting.create({ data: req.body });
//         res.status(201).json(job);
//     } catch (err) {
//         console.error(err);
//         res.status(400).json({ error: err.message });
//     }
// };

// // ✅ Get job by ID
// exports.getJobById = async (req, res) => {
//     const jobId = parseInt(req.params.id, 10);
//     try {
//         const job = await prisma.jobPosting.findUnique({ where: { id: jobId } });
//         if (!job) return res.status(404).json({ error: 'Job not found' });
//         res.json(job);
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// };

// // ✅ Search/filter jobs
// exports.getJobs = async (req, res) => {
//     const {
//         role,
//         experience,
//         location,
//         workMode,
//         salary,
//         freshness,
//         sort = 'latest',
//         page = 1,
//         limit = 10,
//     } = req.query;

//     const where = {
//         AND: [],
//     };

//     // if (role) {
//     //     where.AND.push({
//     //         title: { contains: role, mode: 'insensitive' },
//     //     });
//     // }
//     if (role) {
//         where.AND.push({
//             title: {
//                 contains: role.toLowerCase(), // removed mode
//             }
//         });
//     }

//     if (experience) {
//         const exp = parseInt(experience, 10);
//         where.AND.push(
//             { experienceMin: { lte: exp } },
//             { experienceMax: { gte: exp } }
//         );
//     }

//     if (location) {
//         where.AND.push({
//             location: { contains: location, mode: 'insensitive' },
//         });
//     }

//     if (workMode) {
//         where.AND.push({
//             workMode: workMode.toUpperCase(),
//         });
//     }

//     if (salary) {
//         const sal = parseInt(salary, 10);
//         where.AND.push(
//             { salaryMin: { lte: sal } },
//             { salaryMax: { gte: sal } }
//         );
//     }

//     if (freshness) {
//         const days = parseInt(freshness, 10);
//         const since = new Date();
//         since.setDate(since.getDate() - days);
//         where.AND.push({
//             postedAt: { gte: since },
//         });
//     }

//     const skip = (page - 1) * limit;

//     try {
//         const jobs = await prisma.jobPosting.findMany({
//             where: where.AND.length ? where : undefined,
//             orderBy: sort === 'latest' ? { createdAt: 'desc' } : undefined,
//             skip: Number(skip),
//             take: Number(limit),
//         });

//         const total = await prisma.jobPosting.count({
//             where: where.AND.length ? where : undefined,
//         });

//         res.json({
//             total,
//             page: Number(page),
//             limit: Number(limit),
//             jobs,
//         });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: err.message });
//     }
// };




// controllers/jobController.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
// :white_check_mark: Create Job (Employer only)
exports.createJob = async (req, res) => {
    try {
        if (req.user.isStudent) {
            return res.status(403).json({ message: "Only employers can post jobs" });
        }
        const {
            title, description, location, workMode,
            experienceMin, experienceMax, salaryMin, salaryMax,
            companyName, Requirements, Skills, Qualification, applyLink, TotalNoCandidates, Notice, Deadline, CreatedBy
        } = req.body;
        const job = await prisma.jobPosting.create({
            data: {
                title,
                description,
                location,
                workMode,
                experienceMin,
                experienceMax,
                salaryMin,
                salaryMax,
                companyName,
                Requirements,
                Skills,
                Qualification,
                applyLink,
                TotalNoCandidates,
                Notice,
                Deadline,
                CreatedBy,
                userId: req.user.id
            }
        });
        res.status(201).json({ message: "Job created", job });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};
// :white_check_mark: Update Job
exports.updateJob = async (req, res) => {
    try {
        const job = await prisma.jobPosting.findUnique({ where: { id: Number(req.params.id) } });
        if (!job) return res.status(404).json({ message: "Job not found" });
        if (job.userId !== req.user.id) return res.status(403).json({ message: "Not your job" });
        const updated = await prisma.jobPosting.update({
            where: { id: job.id },
            data: req.body
        });
        res.json({ message: "Job updated", job: updated });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};
// :white_check_mark: Delete Job
exports.deleteJob = async (req, res) => {
    try {
        const job = await prisma.jobPosting.findUnique({ where: { id: Number(req.params.id) } });
        if (!job) return res.status(404).json({ message: "Job not found" });
        if (job.userId !== req.user.id) return res.status(403).json({ message: "Not your job" });
        await prisma.jobPosting.delete({ where: { id: job.id } });
        res.json({ message: "Job deleted" });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};
// :white_check_mark: Get All Jobs (For students)
exports.getAllJobs = async (req, res) => {
    try {
        const jobs = await prisma.jobPosting.findMany({
            include: {
                user: { select: { first_name: true, last_name: true, email: true } }
            }
        });
        res.json(jobs);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};
// :white_check_mark: Employer Dashboard (My Jobs + Applicants list)
exports.getEmployerJobsWithApplicants = async (req, res) => {
    try {
        const jobs = await prisma.jobPosting.findMany({
            where: { userId: req.user.id },
            include: {
                jobApplication: {
                    include: {
                        user: {
                            select: { id: true, first_name: true, last_name: true, email: true }
                        }
                    }
                }
            }
        });
        res.json(jobs);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};