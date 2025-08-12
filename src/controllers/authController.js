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






// const { PrismaClient } = require("@prisma/client");
// const {
//     generateToken,
//     hashPassword,
//     comparePassword,
// } = require("../utils/auth");

// const { OAuth2Client } = require("google-auth-library");
// const axios = require("axios");
// require("dotenv").config();

// const prisma = new PrismaClient();
// const googleClient = new OAuth2Client();

// // // ✅ SIGNUP API
// // exports.signup = async (req, res) => {
// //     try {
// //         const { first_name, last_name, email, phone, password } = req.body;

// //         const existingUser = await prisma.user.findUnique({ where: { email } });
// //         if (existingUser) {
// //             return res.status(400).json({ message: "Email already registered" });
// //         }

// //         const hashed = await hashPassword(password);

// //         const user = await prisma.user.create({
// //             data: {
// //                 first_name,
// //                 last_name,
// //                 email,
// //                 phone,
// //                 password: hashed,
// //             },
// //         });

// //         const token = generateToken(user);

// //         res.status(201).json({ message: "Signup successful", token, user });
// //     } catch (err) {
// //         console.error(err);
// //         res.status(500).json({ message: "Server error" });
// //     }
// // };

// // // ✅ LOGIN API
// // exports.login = async (req, res) => {
// //     try {
// //         const { email, password } = req.body;

// //         const user = await prisma.user.findUnique({ where: { email } });
// //         if (!user) return res.status(404).json({ message: "User not found" });

// //         const isMatch = await comparePassword(password, user.password);
// //         if (!isMatch) return res.status(401).json({ message: "Invalid password" });

// //         const token = generateToken(user);

// //         res.json({ message: "Login successful", token, user });
// //     } catch (err) {
// //         console.error(err);
// //         res.status(500).json({ message: "Server error" });
// //     }
// // };

// exports.signup = async (req, res) => {
//     try {
//         const { first_name, last_name, email, phone, password, profile_type } = req.body;

//         const existingUser = await prisma.user.findUnique({ where: { email } });
//         if (existingUser) {
//             return res.status(400).json({ message: "Email already registered" });
//         }

//         const hashed = await hashPassword(password);

//         // 👇 convert profile_type to boolean
//         const isStudent = profile_type === "student" ? true : false;

//         const user = await prisma.user.create({
//             data: {
//                 first_name,
//                 last_name,
//                 email,
//                 phone,
//                 password: hashed,
//                 isStudent,
//             },
//         });

//         const token = generateToken(user);

//         res.status(201).json({
//             message: "Signup successful",
//             token,
//             user,
//             redirectTo: isStudent ? "student-dashboard" : "employer-dashboard", // 👈 optional redirect
//         });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: "Server error" });
//     }
// };

// exports.login = async (req, res) => {
//     try {
//         const { email, password } = req.body;

//         const user = await prisma.user.findUnique({ where: { email } });
//         if (!user) return res.status(404).json({ message: "User not found" });

//         const isMatch = await comparePassword(password, user.password);
//         if (!isMatch) return res.status(401).json({ message: "Invalid password" });

//         const token = generateToken(user);

//         res.json({
//             message: "Login successful",
//             token,
//             user,
//             redirectTo: user.isStudent ? "student-dashboard" : "employer-dashboard", // 👈 optional
//         });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: "Server error" });
//     }
// };





// // ✅ SOCIAL LOGIN API (Google, LinkedIn, Facebook)
// exports.socialLogin = async (req, res) => {
//     const { provider, token } = req.body;
//     console.log("req.body", req.body)

//     if (!provider || !token) {
//         return res.status(400).json({ message: "Provider and token are required" });
//     }

//     try {
//         let email, first_name, last_name, social_id;

//         if (provider === "google") {
//             const ticket = await googleClient.verifyIdToken({
//                 idToken: token,
//                 audience: process.env.GOOGLE_CLIENT_ID,
//             });

//             const payload = ticket.getPayload();
//             email = payload.email;
//             first_name = payload.given_name;
//             last_name = payload.family_name || "";
//             social_id = payload.sub;

//         } else if (provider === "facebook") {
//             const fbRes = await axios.get(
//                 `https://graph.facebook.com/me?fields=id,name,email&access_token=${token}`
//             );

//             const [first, last] = fbRes.data.name.split(" ");
//             email = fbRes.data.email;
//             first_name = first;
//             last_name = last;
//             social_id = fbRes.data.id;

//         } else if (provider === "linkedin") {
//             const profileRes = await axios.get("https://api.linkedin.com/v2/me", {
//                 headers: { Authorization: `Bearer ${token}` },
//             });

//             const emailRes = await axios.get(
//                 "https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))",
//                 {
//                     headers: { Authorization: `Bearer ${token}` },
//                 }
//             );

//             const fullName = profileRes.data.localizedFirstName + " " + profileRes.data.localizedLastName;
//             const [first, last] = fullName.split(" ");
//             email = emailRes.data.elements[0]["handle~"].emailAddress;
//             first_name = first;
//             last_name = last;
//             social_id = profileRes.data.id;

//         } else {
//             return res.status(400).json({ message: "Unsupported provider" });
//         }

//         let user = await prisma.user.findUnique({ where: { email } });

//         if (!user) {
//             user = await prisma.user.create({
//                 data: {
//                     email,
//                     first_name,
//                     last_name,
//                     social_provider: provider,
//                     social_id,
//                     password: "", // Social login users don't need password
//                 },
//             });
//         }

//         const jwt = generateToken(user);

//         res.json({ message: "Social login successful", token: jwt, user });

//     } catch (err) {
//         console.error(err);
//         res.status(401).json({ message: "Social login failed", error: err.message });
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
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ✅ SIGNUP API (with profile_type logic)
exports.signup = async (req, res) => {
    try {
        const { first_name, last_name, email, phone, password, profile_type, roleInOrganization } = req.body;

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" });
        }

        const hashed = await hashPassword(password);

        const isStudent = profile_type === "student";

        const user = await prisma.user.create({
            data: {
                first_name,
                last_name,
                email,
                phone,
                password: hashed,
                isStudent,
                roleInOrganization: roleInOrganization || null // optional
            },
        });

        const token = generateToken(user);

        res.status(201).json({
            message: "Signup successful",
            token,
            user,
            redirectTo: isStudent ? "student-dashboard" : "employer-dashboard",
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// ✅ LOGIN API
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
            redirectTo: user.isStudent ? "student-dashboard" : "employer-dashboard",
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// ✅ SOCIAL LOGIN API (Google, Facebook, LinkedIn)
exports.socialLogin = async (req, res) => {
    const { provider, token } = req.body;
    console.log("req.body", req.body)

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

// ✅ GOOGLE OAUTH CALLBACK HANDLER
// exports.googleCallback = async (req, res) => {
//     const { code } = req.query;

//     if (!code) {
//         return res.status(400).json({ message: "Authorization code is missing" });
//     }

//     try {
//         // Exchange code for tokens
//         const { tokens } = await googleClient.getToken(code);
//         googleClient.setCredentials(tokens);

//         // Verify and get user info
//         const ticket = await googleClient.verifyIdToken({
//             idToken: tokens.id_token,
//             audience: process.env.GOOGLE_CLIENT_ID,
//         });

//         const payload = ticket.getPayload();
//         const email = payload.email;
//         const first_name = payload.given_name;
//         const last_name = payload.family_name || "";
//         const social_id = payload.sub;

//         // Check or create user
//         let user = await prisma.user.findUnique({ where: { email } });

//         if (!user) {
//             user = await prisma.user.create({
//                 data: {
//                     email,
//                     first_name,
//                     last_name,
//                     social_provider: 'google',
//                     social_id,
//                     password: "",
//                 },
//             });
//         }

//         const jwt = generateToken(user);

//         res.json({
//             message: "Google OAuth login successful",
//             token: jwt,
//             user,
//         });

//         // Or redirect if needed
//         // res.redirect(`http://localhost:3000/dashboard?token=${jwt}`);
//     } catch (err) {
//         console.error("Google callback error:", err);
//         res.status(500).json({ message: "Failed to authenticate user", error: err.message });
//     }
// };


// 👇 Google Callback Controller
exports.googleCallback = async (req, res) => {
    const code = req.query.code;

    if (!code) return res.status(400).json({ message: "Code not found in callback" });

    try {
        // 🔁 Exchange code for access_token
        const response = await axios.post("https://oauth2.googleapis.com/token", null, {
            params: {
                code,
                client_id: process.env.GOOGLE_CLIENT_ID,
                client_secret: process.env.GOOGLE_CLIENT_SECRET,
                redirect_uri: process.env.GOOGLE_REDIRECT_URI, // example: http://localhost:3000/api/auth/google/callback
                grant_type: "authorization_code"
            }
        });

        const { access_token } = response.data;

        // 🧠 Reuse existing socialLogin logic
        req.body = {
            provider: "google",
            token: access_token,
        };

        return exports.socialLogin(req, res); // call existing function
    } catch (error) {
        console.error("Google Callback Error:", error.response?.data || error.message);
        return res.status(500).json({ message: "Google callback failed" });
    }
};


// ✅ GET all signup users (admin)
exports.getUsers = async (_req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                first_name: true,
                last_name: true,
                email: true,
                phone: true,
                isStudent: true,
                roleInOrganization: true,
                created_at: true, // 👈 snake_case
            },
            orderBy: {
                created_at: "desc", // 👈 snake_case
            },
        });

        // (optional) response me camelCase chahiye to map kar do
        const data = users.map(u => ({
            ...u,
            createdAt: u.created_at,
            // updatedAt bhi chahiye to include in select & map similarly
        }));

        res.status(200).json({
            message: "Users fetched successfully",
            count: users.length,
            data,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// ✅ GET user by ID
exports.getUserById = async (req, res) => {
    try {
        const userId = Number(req.params.id);
        if (!Number.isInteger(userId)) {
            return res.status(400).json({ message: "Invalid user id" });
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                first_name: true,
                last_name: true,
                email: true,
                phone: true,
                isStudent: true,
                roleInOrganization: true,
                created_at: true, // 👈 snake_case
                // updated_at: true, // (agar chahiye)
            },
        });

        if (!user) return res.status(404).json({ message: "User not found" });

        // (optional) camelCase response
        const out = {
            ...user,
            createdAt: user.created_at,
            // updatedAt: user.updated_at,
        };
        delete out.created_at;
        // delete out.updated_at;

        res.status(200).json(out);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};














