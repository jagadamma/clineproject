const express = require("express");
const router = express.Router();
const isAuthenticated = require("../middlewares/authMiddleware");// tumhara auth middleware
const userDataFullController = require("../controllers/userDataFullController");

// Single user full snapshot
router.get("/users/:id/fullView", isAuthenticated, userDataFullController.getUserFull);

// (Optional) All users with nested data (paginated)
router.get("/users/fullView", isAuthenticated, userDataFullController.listUsersFull);

module.exports = router;
