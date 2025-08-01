const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// ✅ GET Profile
exports.getProfile = async (req, res) => {
    const userId = req.user.id; // comes from JWT middleware
    console.log("id", req.user.id)
    try {
        const profile = await prisma.userProfile.findUnique({
            where: { user_id: userId },
        });

        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }

        res.json({ profile });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Something went wrong" });
    }
};

// ✅ UPDATE or CREATE Profile
exports.updateProfile = async (req, res) => {
    const userId = req.user.id;
    const data = req.body;

    try {
        const existingProfile = await prisma.userProfile.findUnique({
            where: { user_id: userId },
        });

        if (existingProfile) {
            const updated = await prisma.userProfile.update({
                where: { user_id: userId },
                data,
            });

            res.json({ message: "Profile updated", profile: updated });
        } else {
            const created = await prisma.userProfile.create({
                data: {
                    user_id: userId,
                    ...data,
                },
            });

            res.json({ message: "Profile created", profile: created });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Something went wrong" });
    }
};
