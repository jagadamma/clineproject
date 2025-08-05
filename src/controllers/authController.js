// const { PrismaClient } = require("@prisma/client");
// const {
//     generateToken,
//     hashPassword,
//     comparePassword,
// } = require("../utils/auth");

// const prisma = new PrismaClient();

// // Signup API
// exports.signup = async (req, res) => {
//     try {
//         const { first_name, last_name, email, phone, password } = req.body;

//         const existingUser = await prisma.user.findUnique({ where: { email } });
//         if (existingUser) {
//             return res.status(400).json({ message: "Email already registered" });
//         }

//         const hashed = await hashPassword(password);

//         const user = await prisma.user.create({
//             data: {
//                 first_name,
//                 last_name,
//                 email,
//                 phone,
//                 password: hashed,
//             },
//         });

//         const token = generateToken(user);

//         res.status(201).json({ message: "Signup successful", token, user });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: "Server error" });
//     }
// };



// // Login API-----------------------------------------------------------------------------
// exports.login = async (req, res) => {
//     try {
//         const { email, password } = req.body;

//         const user = await prisma.user.findUnique({ where: { email } });
//         if (!user) return res.status(404).json({ message: "User not found" });

//         const isMatch = await comparePassword(password, user.password);
//         if (!isMatch) return res.status(401).json({ message: "Invalid password" });

//         const token = generateToken(user);

//         res.json({ message: "Login successful", token, user });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: "Server error" });
//     }
// };






const { PrismaClient } = require("@prisma/client");
const {
    generateToken,
    hashPassword,
    comparePassword,
} = require("../utils/auth");

const { OAuth2Client } = require("google-auth-library");
const axios = require("axios");
require("dotenv").config();

const prisma = new PrismaClient();
const googleClient = new OAuth2Client();

// // ✅ SIGNUP API
// exports.signup = async (req, res) => {
//     try {
//         const { first_name, last_name, email, phone, password } = req.body;

//         const existingUser = await prisma.user.findUnique({ where: { email } });
//         if (existingUser) {
//             return res.status(400).json({ message: "Email already registered" });
//         }

//         const hashed = await hashPassword(password);

//         const user = await prisma.user.create({
//             data: {
//                 first_name,
//                 last_name,
//                 email,
//                 phone,
//                 password: hashed,
//             },
//         });

//         const token = generateToken(user);

//         res.status(201).json({ message: "Signup successful", token, user });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: "Server error" });
//     }
// };

// // ✅ LOGIN API
// exports.login = async (req, res) => {
//     try {
//         const { email, password } = req.body;

//         const user = await prisma.user.findUnique({ where: { email } });
//         if (!user) return res.status(404).json({ message: "User not found" });

//         const isMatch = await comparePassword(password, user.password);
//         if (!isMatch) return res.status(401).json({ message: "Invalid password" });

//         const token = generateToken(user);

//         res.json({ message: "Login successful", token, user });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: "Server error" });
//     }
// };

exports.signup = async (req, res) => {
    try {
        const { first_name, last_name, email, phone, password, profile_type } = req.body;

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" });
        }

        const hashed = await hashPassword(password);

        // 👇 convert profile_type to boolean
        const isStudent = profile_type === "student" ? true : false;

        const user = await prisma.user.create({
            data: {
                first_name,
                last_name,
                email,
                phone,
                password: hashed,
                isStudent,
            },
        });

        const token = generateToken(user);

        res.status(201).json({
            message: "Signup successful",
            token,
            user,
            redirectTo: isStudent ? "student-dashboard" : "employer-dashboard", // 👈 optional redirect
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(404).json({ message: "User not found" });

        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Invalid password" });

        const token = generateToken(user);

        res.json({
            message: "Login successful",
            token,
            user,
            redirectTo: user.isStudent ? "student-dashboard" : "employer-dashboard", // 👈 optional
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};





// ✅ SOCIAL LOGIN API (Google, LinkedIn, Facebook)
exports.socialLogin = async (req, res) => {
    const { provider, token } = req.body;

    if (!provider || !token) {
        return res.status(400).json({ message: "Provider and token are required" });
    }

    try {
        let email, first_name, last_name, social_id;

        if (provider === "google") {
            const ticket = await googleClient.verifyIdToken({
                idToken: token,
                audience: process.env.GOOGLE_CLIENT_ID,
            });

            const payload = ticket.getPayload();
            email = payload.email;
            first_name = payload.given_name;
            last_name = payload.family_name || "";
            social_id = payload.sub;

        } else if (provider === "facebook") {
            const fbRes = await axios.get(
                `https://graph.facebook.com/me?fields=id,name,email&access_token=${token}`
            );

            const [first, last] = fbRes.data.name.split(" ");
            email = fbRes.data.email;
            first_name = first;
            last_name = last;
            social_id = fbRes.data.id;

        } else if (provider === "linkedin") {
            const profileRes = await axios.get("https://api.linkedin.com/v2/me", {
                headers: { Authorization: `Bearer ${token}` },
            });

            const emailRes = await axios.get(
                "https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))",
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            const fullName = profileRes.data.localizedFirstName + " " + profileRes.data.localizedLastName;
            const [first, last] = fullName.split(" ");
            email = emailRes.data.elements[0]["handle~"].emailAddress;
            first_name = first;
            last_name = last;
            social_id = profileRes.data.id;

        } else {
            return res.status(400).json({ message: "Unsupported provider" });
        }

        let user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            user = await prisma.user.create({
                data: {
                    email,
                    first_name,
                    last_name,
                    social_provider: provider,
                    social_id,
                    password: "", // Social login users don't need password
                },
            });
        }

        const jwt = generateToken(user);

        res.json({ message: "Social login successful", token: jwt, user });

    } catch (err) {
        console.error(err);
        res.status(401).json({ message: "Social login failed", error: err.message });
    }
};
