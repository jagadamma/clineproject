const express = require("express");
const router = express.Router();
const { adminLogin, adminMe } = require('../../controllers/Admin/admin.auth.controller.js');
const { requireAdminAuth } = require('../../middlewares/adminAuth.js');

router.post('/login', adminLogin);
router.get('/me', requireAdminAuth, adminMe);

module.exports = router;
