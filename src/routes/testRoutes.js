const express = require("express");
const router = express.Router();
const isAuthenticated = require("../middlewares/authMiddleware");

router.get("/me", isAuthenticated, (req, res) => {
    res.json({ message: "User verified", user: req.user });
});

module.exports = router;
