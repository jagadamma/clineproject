const jwt = require('jsonwebtoken');

const requireAdminAuth = (req, res, next) => {
    const h = req.headers.authorization || '';
    const token = h.startsWith('Bearer ') ? h.slice(7) : null;
    if (!token) return res.status(401).json({ message: 'Missing token' });

    try {
        const decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET, {
            audience: 'admin-panel',
            issuer: 'your-app',
        });

        if (decoded?.typ !== 'admin') {
            return res.status(401).json({ message: 'Invalid token type' });
        }

        req.adminId = decoded.sub;
        req.adminClaims = decoded; // { sub, typ:'admin', email, isSuper }
        next();
    } catch (e) {
        return res.status(401).json({ message: 'Invalid/expired token' });
    }
};

const requireSuperAdmin = (req, res, next) => {
    if (!req.adminClaims?.isSuper) {
        return res.status(403).json({ message: 'Super admin only' });
    }
    next();
};

// Optional: scope guard
const requireScope = (scope, action) => {
    return (req, res, next) => {
        // You can fetch scopes from DB if not embedded:
        // assuming scopes are stored in DB; you might preload them
        next();
    };
};

module.exports = { requireAdminAuth, requireSuperAdmin, requireScope };
