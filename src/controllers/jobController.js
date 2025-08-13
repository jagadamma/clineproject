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

/* ---------- helpers ---------- */

// Prefer JWT -> req.user.id; fallback: body/query userId
function getAuthUserId(req) {
    const raw = req.user?.id ?? req.body?.userId ?? req.query?.userId;
    const n = Number(raw);
    return Number.isFinite(n) && n > 0 ? n : null;
}

// Normalize incoming body
function normalizeJobPayload(body = {}) {
    const out = { ...body };

    // Trim string-ish fields; empty string -> null
    [
        "title",
        "description",
        "location",
        "companyName",
        "companyLogo",
        "applyLink",
        "Requirements",
        "Skills",
        "Qualification",
        "TotalNoCandidates",
        "Notice",
        "Deadline",
        "CreatedBy",
    ].forEach((k) => {
        if (out[k] !== undefined && out[k] !== null) {
            out[k] = String(out[k]).trim();
            if (out[k] === "") out[k] = null;
        }
    });

    // workMode as enum UPPERCASE (REMOTE/HYBRID/ONSITE - whatever you defined)
    if (out.workMode) out.workMode = String(out.workMode).toUpperCase();

    // Numbers
    ["experienceMin", "experienceMax", "salaryMin", "salaryMax"].forEach((k) => {
        if (out[k] !== undefined && out[k] !== null) {
            const n = Number(out[k]);
            out[k] = Number.isFinite(n) ? n : null;
        }
    });

    // Ensure applyLink has scheme
    if (out.applyLink && !/^https?:\/\//i.test(out.applyLink)) {
        out.applyLink = `https://${out.applyLink}`;
    }

    return out;
}

function prismaError(res, err) {
    console.error("Job controller error:", err);
    const code = err?.code;
    const status =
        code === "P2002" ? 409 : // unique
            code === "P2003" ? 400 : // FK
                500;
    const message =
        code === "P2002"
            ? "Unique constraint failed"
            : code === "P2003"
                ? "Invalid reference (foreign key)"
                : err?.message || "Server error";
    return res.status(status).json({ message, code, meta: err?.meta });
}

/* ---------- Create Job (Employer only) ---------- */
exports.createJob = async (req, res) => {
    try {
        // Must be employer (not student)
        if (req.user?.isStudent) {
            return res.status(403).json({ message: "Only employers can post jobs" });
        }

        const userId = getAuthUserId(req);
        if (userId == null) {
            return res.status(400).json({ message: "userId missing/invalid" });
        }

        // Clean payload
        const payload = normalizeJobPayload(req.body);

        // Minimal required fields check (adjust as per your needs)
        const required = ["title", "description", "location", "workMode", "companyName", "applyLink"];
        const missing = required.filter((k) => !payload[k]);
        if (missing.length) {
            return res.status(400).json({ message: `Missing fields: ${missing.join(", ")}` });
        }

        // CreatedBy optional already handled by normalizer (null if empty)
        const job = await prisma.jobPosting.create({
            data: {
                ...payload,
                userId, // Int (nullable in schema is fine; but here we set it)
            },
        });

        return res.status(201).json({ message: "Job created", job });
    } catch (err) {
        return prismaError(res, err);
    }
};

/* ---------- Update Job ---------- */
exports.updateJob = async (req, res) => {
    try {
        const userId = getAuthUserId(req);
        if (userId == null) {
            return res.status(400).json({ message: "userId missing/invalid" });
        }
        if (req.user?.isStudent) {
            return res.status(403).json({ message: "Only employers can update jobs" });
        }

        const id = Number(req.params.id);
        if (!Number.isFinite(id)) return res.status(400).json({ message: "Invalid job id" });

        const job = await prisma.jobPosting.findUnique({ where: { id } });
        if (!job) return res.status(404).json({ message: "Job not found" });

        if (job.userId !== userId) {
            return res.status(403).json({ message: "Not your job" });
        }

        // Prevent userId tampering & normalize rest
        const { userId: _ignore, ...rest } = req.body || {};
        const data = normalizeJobPayload(rest);

        const updated = await prisma.jobPosting.update({
            where: { id },
            data,
        });

        return res.json({ message: "Job updated", job: updated });
    } catch (err) {
        return prismaError(res, err);
    }
};

/* ---------- Delete Job ---------- */
exports.deleteJob = async (req, res) => {
    try {
        const userId = getAuthUserId(req);
        if (userId == null) {
            return res.status(400).json({ message: "userId missing/invalid" });
        }
        if (req.user?.isStudent) {
            return res.status(403).json({ message: "Only employers can delete jobs" });
        }

        const id = Number(req.params.id);
        if (!Number.isFinite(id)) return res.status(400).json({ message: "Invalid job id" });

        const job = await prisma.jobPosting.findUnique({ where: { id } });
        if (!job) return res.status(404).json({ message: "Job not found" });

        if (job.userId !== userId) {
            return res.status(403).json({ message: "Not your job" });
        }

        await prisma.jobPosting.delete({ where: { id } });
        return res.json({ message: "Job deleted" });
    } catch (err) {
        return prismaError(res, err);
    }
};

/* ---------- Get All Jobs (students) ---------- */
exports.getAllJobs = async (req, res) => {
    try {
        const jobs = await prisma.jobPosting.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                user: { select: { first_name: true, last_name: true, email: true } },
            },
        });
        return res.json(jobs);
    } catch (err) {
        return prismaError(res, err);
    }
};

/* ---------- Employer Dashboard: My Jobs + Applicants ---------- */
exports.getEmployerJobsWithApplicants = async (req, res) => {
    try {
        const userId = getAuthUserId(req);
        if (userId == null) return res.status(400).json({ message: "userId missing/invalid" });

        const jobs = await prisma.jobPosting.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
            include: {
                jobApplication: {
                    include: {
                        user: { select: { id: true, first_name: true, last_name: true, email: true } },
                    },
                },
            },
        });
        return res.json(jobs);
    } catch (err) {
        return prismaError(res, err);
    }
};
