const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/** Prefer JWT middleware se: req.user.id
 *  Fallback: body/query me userId
 */
function getAuthUserId(req) {
    if (req.user?.id) return Number(req.user.id);
    if (req.body?.userId) return Number(req.body.userId);
    if (req.query?.userId) return Number(req.query.userId);
    return null;
}

/** Normalize/parse payload */
function normalizePayload(body) {
    const out = { ...body };

    // Required: companyName should be non-empty string
    if (typeof out.companyName === 'string') {
        out.companyName = out.companyName.trim();
    }

    // Optional text fields: empty string -> null
    // ['founderCEO', 'overview', 'website', 'address', 'gstNo', 'regdNo','companyEmail','companyPhone','industrySector'].forEach((k) => {
    //     if (out[k] !== undefined) {
    //         if (typeof out[k] === 'string') out[k] = out[k].trim();
    //         if (out[k] === '') out[k] = null;
    //     }
    // });
    ['founderCEO', 'overview', 'website', 'address', 'gstNo', 'regdNo', 'companyEmail', 'companyPhone', 'industrySector']
        .forEach(k => { if (out[k] === '') out[k] = null; });


    // companyType enum (optional: uppercase normalize)
    if (out.companyType) {
        out.companyType = String(out.companyType).toUpperCase(); // 'private' -> 'PRIVATE'
        const allowed = ['PRIVATE', 'PUBLIC', 'NONPROFIT', 'GOVERNMENT'];
        if (!allowed.includes(out.companyType)) out.companyType = null;
    }

    // estYear -> number or null
    if (out.estYear !== undefined) {
        if (out.estYear === '' || out.estYear === null) {
            out.estYear = null;
        } else {
            const n = Number(out.estYear);
            out.estYear = Number.isNaN(n) ? null : n;
        }
    }

    // socialLinks -> JSON
    if (out.socialLinks !== undefined) {
        if (typeof out.socialLinks === 'string') {
            try { out.socialLinks = JSON.parse(out.socialLinks); } catch { out.socialLinks = null; }
        }
        // if it's already an object/array, keep as is
    }

    return out;
}

/** CREATE/UPDATE (UPSERT)
 * POST /api/employer/profile
 * Body: { userId, companyName, founderCEO?, overview?, website?, address?, gstNo?, regdNo?, estYear?, socialLinks? }
 */
exports.saveEmployerProfile = async (req, res) => {
    try {
        const userId = getAuthUserId(req);
        if (!userId) return res.status(400).json({ message: 'userId missing' });

        const payload = normalizePayload(req.body);

        if (!payload.companyName) {
            return res.status(400).json({ message: 'companyName is required' });
        }

        // Upsert by userId (unique)
        const profile = await prisma.employerProfile.upsert({
            where: { userId },
            create: { ...payload, userId },
            update: { ...payload },
        });

        return res.status(200).json({ message: 'Employer profile saved', profile });
    } catch (err) {
        console.error('saveEmployerProfile error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
};

/** READ (by user)
 * GET /api/employer/profile?userId=123
 * or with auth -> req.user.id
 */
exports.getEmployerProfile = async (req, res) => {
    try {
        const userId = getAuthUserId(req);
        if (!userId) return res.status(400).json({ message: 'userId missing' });

        const profile = await prisma.employerProfile.findUnique({ where: { userId } });
        if (!profile) return res.status(404).json({ message: 'Employer profile not found' });

        return res.json({ profile });
    } catch (err) {
        console.error('getEmployerProfile error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
};

/** DELETE (by user)
 * DELETE /api/employer/profile?userId=123
 */
exports.deleteEmployerProfile = async (req, res) => {
    try {
        const userId = getAuthUserId(req);
        if (!userId) return res.status(400).json({ message: 'userId missing' });

        await prisma.employerProfile.delete({ where: { userId } });
        return res.json({ message: 'Employer profile deleted' });
    } catch (err) {
        if (err.code === 'P2025') {
            return res.status(404).json({ message: 'Employer profile not found' });
        }
        console.error('deleteEmployerProfile error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
};

/** LIST (admin)
 * GET /api/employer/profiles
 */
exports.listEmployerProfiles = async (_req, res) => {
    try {
        const profiles = await prisma.employerProfile.findMany({
            orderBy: { updatedAt: 'desc' },
        });
        return res.json({ count: profiles.length, profiles });
    } catch (err) {
        console.error('listEmployerProfiles error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
};
