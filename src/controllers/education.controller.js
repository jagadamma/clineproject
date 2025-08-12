// src/controllers/education.controller.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Create a new education record for a user
 * Body: { userId, courseDegree, specialization?, universityName, marks?, startDate, endDate?, isCurrent? }
 */
exports.createEducation = async (req, res) => {
    try {
        const {
            userId,
            courseDegree,
            specialization,
            universityName,
            marks,
            startDate,
            endDate,
            isCurrent,
        } = req.body;

        if (!userId || !courseDegree || !universityName || !startDate) {
            return res.status(400).json({ message: 'userId, courseDegree, universityName, startDate are required' });
        }

        const data = {
            userId: Number(userId),
            courseDegree: String(courseDegree),
            specialization: specialization ?? null,
            universityName: String(universityName),
            marks: marks ?? null,
            startDate: new Date(startDate),
            endDate: endDate ? new Date(endDate) : null,
            isCurrent: Boolean(isCurrent) || false,
        };

        // Guard: if isCurrent true, force endDate null
        if (data.isCurrent) data.endDate = null;

        const edu = await prisma.education.create({ data });
        return res.status(201).json(edu);
    } catch (err) {
        console.error('createEducation error:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

/** Get all educations for a user: /users/:userId/educations */
exports.getEducationsByUser = async (req, res) => {
    try {
        const userId = Number(req.params.userId);
        const list = await prisma.education.findMany({
            where: { userId },
            orderBy: [{ startDate: 'desc' }],
        });
        return res.json(list);
    } catch (err) {
        console.error('getEducationsByUser error:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

/** Get single education by id */
exports.getEducationById = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const edu = await prisma.education.findUnique({ where: { id } });
        if (!edu) return res.status(404).json({ message: 'Not found' });
        return res.json(edu);
    } catch (err) {
        console.error('getEducationById error:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

/** Update education by id (partial) */
exports.updateEducation = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const payload = { ...req.body };

        if (payload.userId) payload.userId = Number(payload.userId);
        if (payload.startDate) payload.startDate = new Date(payload.startDate);
        if (payload.endDate) payload.endDate = new Date(payload.endDate);
        if (payload.isCurrent !== undefined) {
            payload.isCurrent = Boolean(payload.isCurrent);
            if (payload.isCurrent) payload.endDate = null;
        }

        const updated = await prisma.education.update({
            where: { id },
            data: payload,
        });
        return res.json(updated);
    } catch (err) {
        console.error('updateEducation error:', err);
        if (err.code === 'P2025') return res.status(404).json({ message: 'Not found' });
        return res.status(500).json({ message: 'Internal server error' });
    }
};

/** Delete education by id */
exports.deleteEducation = async (req, res) => {
    try {
        const id = Number(req.params.id);
        await prisma.education.delete({ where: { id } });
        return res.status(204).send();
    } catch (err) {
        console.error('deleteEducation error:', err);
        if (err.code === 'P2025') return res.status(404).json({ message: 'Not found' });
        return res.status(500).json({ message: 'Internal server error' });
    }
};
