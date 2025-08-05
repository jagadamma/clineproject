// const { PrismaClient } = require('@prisma/client');
// const prisma = new PrismaClient();

// // ✅ Create job (Admin use)
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
//         sort = 'latest', // or relevance
//         page = 1,
//         limit = 10,
//     } = req.query;

//     const filters = {};

//     if (role) {
//         filters.title = { contains: role, mode: 'insensitive' };
//     }

//     if (experience) {
//         const exp = parseInt(experience, 10);
//         filters.experienceMin = { lte: exp };
//         filters.experienceMax = { gte: exp };
//     }

//     if (location) {
//         filters.location = { contains: location, mode: 'insensitive' };
//     }

//     if (workMode) {
//         filters.workMode = workMode.toUpperCase();
//     }

//     if (salary) {
//         const sal = parseInt(salary, 10);
//         filters.salaryMin = { lte: sal };
//         filters.salaryMax = { gte: sal };
//     }

//     if (freshness) {
//         const days = parseInt(freshness, 10);
//         const since = new Date();
//         since.setDate(since.getDate() - days);
//         filters.postedAt = { gte: since };
//     }

//     const skip = (page - 1) * limit;

//     try {
//         const jobs = await prisma.jobPosting.findMany({
//             where: filters,
//             orderBy: sort === 'latest' ? { createdAt: 'desc' } : undefined,
//             skip: Number(skip),
//             take: Number(limit),
//         });

//         const total = await prisma.jobPosting.count({ where: filters });

//         res.json({
//             total,
//             page: Number(page),
//             limit: Number(limit),
//             jobs,
//         });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// };


const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ✅ Create job (Admin use)
exports.createJob = async (req, res) => {
    try {
        const job = await prisma.jobPosting.create({ data: req.body });
        res.status(201).json(job);
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: err.message });
    }
};

// ✅ Get job by ID
exports.getJobById = async (req, res) => {
    const jobId = parseInt(req.params.id, 10);
    try {
        const job = await prisma.jobPosting.findUnique({ where: { id: jobId } });
        if (!job) return res.status(404).json({ error: 'Job not found' });
        res.json(job);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ✅ Search/filter jobs
exports.getJobs = async (req, res) => {
    const {
        role,
        experience,
        location,
        workMode,
        salary,
        freshness,
        sort = 'latest',
        page = 1,
        limit = 10,
    } = req.query;

    const where = {
        AND: [],
    };

    // if (role) {
    //     where.AND.push({
    //         title: { contains: role, mode: 'insensitive' },
    //     });
    // }
    if (role) {
        where.AND.push({
            title: {
                contains: role.toLowerCase(), // removed mode
            }
        });
    }

    if (experience) {
        const exp = parseInt(experience, 10);
        where.AND.push(
            { experienceMin: { lte: exp } },
            { experienceMax: { gte: exp } }
        );
    }

    if (location) {
        where.AND.push({
            location: { contains: location, mode: 'insensitive' },
        });
    }

    if (workMode) {
        where.AND.push({
            workMode: workMode.toUpperCase(),
        });
    }

    if (salary) {
        const sal = parseInt(salary, 10);
        where.AND.push(
            { salaryMin: { lte: sal } },
            { salaryMax: { gte: sal } }
        );
    }

    if (freshness) {
        const days = parseInt(freshness, 10);
        const since = new Date();
        since.setDate(since.getDate() - days);
        where.AND.push({
            postedAt: { gte: since },
        });
    }

    const skip = (page - 1) * limit;

    try {
        const jobs = await prisma.jobPosting.findMany({
            where: where.AND.length ? where : undefined,
            orderBy: sort === 'latest' ? { createdAt: 'desc' } : undefined,
            skip: Number(skip),
            take: Number(limit),
        });

        const total = await prisma.jobPosting.count({
            where: where.AND.length ? where : undefined,
        });

        res.json({
            total,
            page: Number(page),
            limit: Number(limit),
            jobs,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};
