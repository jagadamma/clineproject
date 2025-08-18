const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const signAdmin = (admin) => {
    const payload = {
        sub: admin.id,
        typ: 'admin',
        email: admin.email,
        isSuper: admin.isSuper,
    };
    return jwt.sign(payload, process.env.ADMIN_JWT_SECRET, {
        expiresIn: process.env.ADMIN_JWT_EXPIRES_IN || '1d',
        audience: 'admin-panel',
        issuer: 'your-app',
    });
};

const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body ?? {};
        if (!email || !password) return res.status(400).json({ message: 'email & password required' });

        const admin = await prisma.admin.findUnique({ where: { email } });
        if (!admin) return res.status(401).json({ message: 'Invalid credentials' });

        const ok = await bcrypt.compare(password, admin.password);
        if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

        const token = signAdmin(admin);
        await prisma.admin.update({ where: { id: admin.id }, data: { lastLoginAt: new Date() } });

        res.json({
            token,
            admin: {
                id: admin.id,
                email: admin.email,
                fullName: admin.fullName,
                isSuper: admin.isSuper,
                status: admin.status,
            },
        });
    } catch (e) {
        console.error('adminLogin error:', e);
        res.status(500).json({ message: 'Server error' });
    }
};

const adminMe = async (req, res) => {
    try {
        const me = await prisma.admin.findUnique({
            where: { id: req.adminId },
            select: { id: true, email: true, fullName: true, isSuper: true, status: true, scopes: true },
        });
        res.json({ admin: me });
    } catch (e) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { adminLogin, adminMe };
