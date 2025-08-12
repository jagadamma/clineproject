const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create
exports.createWorkExperience = async (req, res) => {
    try {
        const {
            userId,
            company,
            location,
            employmentType,
            role,
            startDate,
            endDate,
            isCurrent,
            responsibilities,
        } = req.body;

        if (!userId || !company || !startDate) {
            return res.status(400).json({ message: 'userId, company, startDate are required' });
        }

        const data = {
            userId: Number(userId),
            company: String(company),
            location: location ?? null,
            employmentType: employmentType ?? null,
            role: role ?? null,
            startDate: new Date(startDate),
            endDate: endDate ? new Date(endDate) : null,
            isCurrent: Boolean(isCurrent) || false,
            responsibilities: responsibilities ?? null,
        };

        if (data.isCurrent) data.endDate = null;

        const exp = await prisma.workExperience.create({ data });
        return res.status(201).json(exp);
    } catch (err) {
        console.error('createWorkExperience error:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// List all for a user
exports.getWorkExperiencesByUser = async (req, res) => {
    try {
        const userId = Number(req.params.userId);
        const list = await prisma.workExperience.findMany({
            where: { userId },
            orderBy: [{ startDate: 'desc' }],
        });
        return res.json(list);
    } catch (err) {
        console.error('getWorkExperiencesByUser error:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// Get one by id
exports.getWorkExperienceById = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const exp = await prisma.workExperience.findUnique({ where: { id } });
        if (!exp) return res.status(404).json({ message: 'Not found' });
        return res.json(exp);
    } catch (err) {
        console.error('getWorkExperienceById error:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// Update (partial)
exports.updateWorkExperience = async (req, res) => {
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

        const updated = await prisma.workExperience.update({
            where: { id },
            data: payload,
        });
        return res.json(updated);
    } catch (err) {
        console.error('updateWorkExperience error:', err);
        if (err.code === 'P2025') return res.status(404).json({ message: 'Not found' });
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// Delete
exports.deleteWorkExperience = async (req, res) => {
    try {
        const id = Number(req.params.id);
        await prisma.workExperience.delete({ where: { id } });
        return res.status(204).send();
    } catch (err) {
        console.error('deleteWorkExperience error:', err);
        if (err.code === 'P2025') return res.status(404).json({ message: 'Not found' });
        return res.status(500).json({ message: 'Internal server error' });
    }
};
