const jwt = require("jsonwebtoken");
require("dotenv").config();

const isAuthenticated = (req, res, next) => {
    const authHeader = req.headers.authorization;

    // Token header exist karta hai?
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized: Token missing" });
    }

    const token = authHeader.split(" ")[1]; // 'Bearer <token>'

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // decoded object me user ki id & email hogi
        next(); // allow request to proceed
    } catch (err) {
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
};

module.exports = isAuthenticated;
