const express = require("express");
const { PrismaClient } = require("@prisma/client");
const cors = require('cors');
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
const employerRoutes = require('./routes/employer.routes');


require("dotenv").config();

const app = express();
// ✅ Secure and domain-specific CORS config
const corsOptions = {
    origin: [
        "http://localhost:5173",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

const prisma = new PrismaClient();

app.use(express.json());

app.use("/api/auth", authRoutes);      //student/employer signup,login
app.use("/api/test", testRoutes);
app.use("/api/profile", profileRoutes);     //studet profile here
app.use("/api/lang", langRoutes)
app.use('/api/courses', courseRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/jobs', jobRoutes);        //inside of employer post job
app.use('/api/user-jobs', jobUserRoutes);
app.use('/api', courseLibraryRoutes);


//employer route here-------
app.use('/api', employerRoutes);

app.get("/", (req, res) => {
    res.send("👋 wwWelcome to cliniAura API");
});
app.listen(3000, '0.0.0.0', () => {
    console.log("🚀 Server running on http://0.0.0.0:3000");
});
