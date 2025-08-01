const { PrismaClient } = require("@prisma/client");
const {
    generateToken,
    hashPassword,
    comparePassword,
} = require("../utils/auth");

const prisma = new PrismaClient();

// Signup API
exports.signup = async (req, res) => {
    try {
        const { first_name, last_name, email, phone, password } = req.body;

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" });
        }

        const hashed = await hashPassword(password);

        const user = await prisma.user.create({
            data: {
                first_name,
                last_name,
                email,
                phone,
                password: hashed,
            },
        });

        const token = generateToken(user);

        res.status(201).json({ message: "Signup successful", token, user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};



// Login API-----------------------------------------------------------------------------
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(404).json({ message: "User not found" });

        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Invalid password" });

        const token = generateToken(user);

        res.json({ message: "Login successful", token, user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};
