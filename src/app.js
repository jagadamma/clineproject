require('dotenv').config();
const express = require("express");
// const { PrismaClient } = require("@prisma/client");
const cors = require('cors');
// const morgan = require('morgan');
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
const educationRoutes = require('./routes/education.routes');
const projectRoutes = require('./routes/project.routes');
const workExpRoutes = require('./routes/workExperience.routes');
const userDataFullRoutes = require("./routes/userDataFullRoutes");
// const profilePicRoutes = require('./routes/profilePic.routes');
const employerRoutesAplicant = require("./routes/employerRoutes");
// const certificateRoutes = require("./routes/certificateRoutes")


// NEW: Admin-only (separate Admin table, no relation to User)
const adminAuthRoutes = require('././routes/AdminRoute/admin.auth.routes');      // /login, /me
const adminManageRoutes = require('././routes/AdminRoute/admin.manage.routes');  // CRUD admins, etc.

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
// app.options('*', cors(corsOptions)); // preflight


// const prisma = new PrismaClient();

app.use(express.json({ limit: '10mb' }));
// app.use(morgan('dev'));

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
app.use('/apiEducation', educationRoutes);
app.use('/apiProject', projectRoutes);
app.use('/apiExp', workExpRoutes);
// app.use('/api/certificates', certificateRoutes);


//view full user data-----
app.use("/apiView", userDataFullRoutes);


//employer route here-------
app.use('/api', employerRoutes);

//profile pic------------
// app.use('/api', profilePicRoutes);

app.use('/api/emp/application', employerRoutesAplicant);


// 🔐 Admin namespace (totally separate from normal users)
app.use('/api/admin/auth', adminAuthRoutes); // POST /login, GET /me
app.use('/api/admin', adminManageRoutes);    // requires admin auth

app.get("/", (req, res) => {
    res.send("👋 Hi WELCOME to suplex & to cliniAura API");
});
app.listen(3000, '0.0.0.0', () => {
    console.log("🚀 Server running on http://0.0.0.0:3000");
});
