const express = require("express");
const { PrismaClient } = require("@prisma/client");
const authRoutes = require("./routes/authRoutes");
const testRoutes = require("./routes/testRoutes");
const profileRoutes = require("./routes/profileRoutes");
const langRoutes = require("./routes/LangRoutes")
const courseRoutes = require('./routes/courseRoutes');
const progressRoutes = require('./routes/progressRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const jobRoutes = require('./routes/jobRoutes');
const jobUserRoutes = require('./routes/jobUserRoutes');
const courseLibraryRoutes = require('./routes/courseLibraryRoutes');


require("dotenv").config();

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/lang", langRoutes)
app.use('/api/courses', courseRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/jobs', jobRoutes);        //inside of employer post job
app.use('/api/user-jobs', jobUserRoutes);
app.use('/api', courseLibraryRoutes);

app.get("/", (req, res) => {
    res.send("👋 WWelcome to cliniAura API");
});

app.listen(3000, () => {
    console.log("🚀 Server running on http://localhost:3000");
});
