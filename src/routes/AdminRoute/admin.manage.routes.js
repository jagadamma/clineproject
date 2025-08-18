const { Router } = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const { requireAdminAuth, requireSuperAdmin } = require('../../middlewares/adminAuth');

const router = Router();

// All routes below need admin login
router.use(requireAdminAuth);

/**
 * SUPER ADMIN: Create/List/Update/Delete Admins
 * Keep this separate so not every admin can create admins.
 */

// Create Admin (Super only)
router.post('/admins', requireSuperAdmin, async (req, res) => {
    try {
        const { fullName, email, password, phone, isSuper = false, scopes, status = 'ACTIVE' } = req.body;
        if (!fullName || !email || !password)
            return res.status(400).json({ message: 'fullName, email, password required' });

        const bcrypt = (await import('bcrypt')).default;
        const hash = await bcrypt.hash(password, 10);

        const created = await prisma.admin.create({
            data: { fullName, email, password: hash, phone, isSuper, scopes, status },
            select: { id: true, fullName: true, email: true, phone: true, isSuper: true, status: true },
        });
        res.status(201).json(created);
    } catch (e) {
        res.status(400).json({ message: 'Bad request', detail: e.message });
    }
});

// List Admins (Super only, with basic search/paginate)
router.get('/admins', requireSuperAdmin, async (req, res) => {
    try {
        const { q, page = 1, limit = 10 } = req.query;
        const take = Number(limit) || 10;
        const skip = (Number(page) - 1) * take;

        const where = q
            ? {
                OR: [
                    { email: { contains: String(q), mode: 'insensitive' } },
                    { fullName: { contains: String(q), mode: 'insensitive' } },
                    { phone: { contains: String(q), mode: 'insensitive' } },
                ],
            }
            : {};

        const [items, total] = await Promise.all([
            prisma.admin.findMany({
                where,
                take,
                skip,
                orderBy: { createdAt: 'desc' },
                select: { id: true, fullName: true, email: true, phone: true, isSuper: true, status: true, lastLoginAt: true },
            }),
            prisma.admin.count({ where }),
        ]);

        res.json({ items, total, page: Number(page), pages: Math.ceil(total / take) });
    } catch (e) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get single admin (self or super)
router.get('/admins/:id', async (req, res) => {
    const id = Number(req.params.id);
    // allow self view or super
    if (!req.adminClaims.isSuper && req.adminId !== id) {
        return res.status(403).json({ message: 'Forbidden' });
    }
    const admin = await prisma.admin.findUnique({
        where: { id },
        select: { id: true, fullName: true, email: true, phone: true, isSuper: true, status: true, scopes: true, lastLoginAt: true },
    });
    if (!admin) return res.status(404).json({ message: 'Not found' });
    res.json(admin);
});

// Update admin (Super or self limited)
router.put('/admins/:id', async (req, res) => {
    const id = Number(req.params.id);

    // Non-super can only update self (and not change isSuper/status)
    if (!req.adminClaims.isSuper && req.adminId !== id) {
        return res.status(403).json({ message: 'Forbidden' });
    }

    const data = { ...req.body };
    // prevent privilege escalation if not super
    if (!req.adminClaims.isSuper) {
        delete data.isSuper;
        delete data.status;
        delete data.scopes;
    }

    // handle password change
    if (data.password) {
        const bcrypt = (await import('bcrypt')).default;
        data.password = await bcrypt.hash(data.password, 10);
    }

    try {
        const updated = await prisma.admin.update({
            where: { id },
            data,
            select: { id: true, fullName: true, email: true, phone: true, isSuper: true, status: true, scopes: true },
        });
        res.json(updated);
    } catch (e) {
        res.status(400).json({ message: 'Bad request', detail: e.message });
    }
});

// Delete admin (Super only; block self-delete)
router.delete('/admins/:id', requireSuperAdmin, async (req, res) => {
    const id = Number(req.params.id);
    if (id === req.adminId) {
        return res.status(400).json({ message: "You can't delete your own admin account" });
    }
    try {
        await prisma.admin.delete({ where: { id } });
        res.json({ ok: true });
    } catch (e) {
        res.status(400).json({ message: 'Bad request', detail: e.message });
    }
});

module.exports = router;
