const express = require("express");
const { PrismaClient } = require("@prisma/client");
const authRoutes = require("./routes/authRoutes");
const testRoutes = require("./routes/testRoutes");
const profileRoutes = require("./routes/profileRoutes");

require("dotenv").config();

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/profile", profileRoutes);

app.get("/", (req, res) => {
    res.send("👋 Welcome to cliniAura API");
});

app.listen(3000, () => {
    console.log("🚀 Server running on http://localhost:3000");
});
