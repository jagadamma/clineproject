const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

const generateToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.TOKEN_EXPIRE || "7d",
        }
    );
};

const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

const comparePassword = async (plain, hashed) => {
    return await bcrypt.compare(plain, hashed);
};

module.exports = {
    generateToken,
    hashPassword,
    comparePassword,
};
