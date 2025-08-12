const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create Project
exports.createProject = async (req, res) => {
    try {
        const { userId, title, status, role, skills, description } = req.body;
        if (!userId || !title) {
            return res.status(400).json({ message: 'userId and title are required' });
        }

        const project = await prisma.project.create({
            data: {
                userId: Number(userId),
                title: String(title),
                status: status ?? null,
                role: role ?? null,
                skills: skills ?? null,
                description: description ?? null,
            },
        });

        return res.status(201).json(project);
    } catch (err) {
        console.error('createProject error:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// List Projects for a User
exports.getProjectsByUser = async (req, res) => {
    try {
        const userId = Number(req.params.userId);
        const items = await prisma.project.findMany({
            where: { userId },
            orderBy: [{ createdAt: 'desc' }],
        });
        return res.json(items);
    } catch (err) {
        console.error('getProjectsByUser error:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// Get single Project
exports.getProjectById = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const item = await prisma.project.findUnique({ where: { id } });
        if (!item) return res.status(404).json({ message: 'Not found' });
        return res.json(item);
    } catch (err) {
        console.error('getProjectById error:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// Update Project (partial)
exports.updateProject = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const payload = { ...req.body };
        if (payload.userId) payload.userId = Number(payload.userId);

        const updated = await prisma.project.update({
            where: { id },
            data: payload,
        });
        return res.json(updated);
    } catch (err) {
        console.error('updateProject error:', err);
        if (err.code === 'P2025') return res.status(404).json({ message: 'Not found' });
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// Delete Project
exports.deleteProject = async (req, res) => {
    try {
        const id = Number(req.params.id);
        await prisma.project.delete({ where: { id } });
        return res.status(204).send();
    } catch (err) {
        console.error('deleteProject error:', err);
        if (err.code === 'P2025') return res.status(404).json({ message: 'Not found' });
        return res.status(500).json({ message: 'Internal server error' });
    }
};
