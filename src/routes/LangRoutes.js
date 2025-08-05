const express = require("express");
const { addLanguages } = require("../controllers/LangController");
const router = express.Router();

router.post('/add-language', addLanguages)


module.exports = router;