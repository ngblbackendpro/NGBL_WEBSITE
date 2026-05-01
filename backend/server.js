const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const port = process.env.PORT || 5000;
const blogRoutes = require("./routes/blogRoutes");
const teamRoutes = require("./routes/teamRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const projectRoutes = require("./routes/projectRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const brandRoutes = require("./routes/brandRoutes");
const workRoutes = require('./routes/workRoutes');
const homeRoutes = require('./routes/homeRoutes');
const contactRoutes = require("./routes/contactRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const legalRoutes = require("./routes/legalPageRoutes");
const connectDB = require("./config/db");
const authRoutes = require('./routes/authRoutes')
const musicBlogRoutes = require('./routes/musicBlogRoute');
const musicContactRoutes = require('./routes/musicContactRoute');
const musicComplianceRoutes = require('./routes/musicComplianceRoutes');
const testimonialRoutes = require('./routes/testimonialRoutes');
const musicMediaRoutes = require('./routes/musicMediaRoutes');
const musicPartnersRoutes = require('./routes/musicPartnersRoutes');


connectDB();


const allowedOrigins = [
  process.env.WEBSITE_URL || "https://ngbl.in",
  process.env.ADMIN_URL || "https://adminpanel.ngbl.in",
  "http://localhost:5500",
  "http://127.0.0.1:5500"
];

app.use(cors({
  origin: function (origin, callback) {
   
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

app.get("/ping", (req, res) => {
  res.status(200).send("Server is alive");
});

app.use("/api/blogs", blogRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/brands", brandRoutes);
app.use('/api/works', workRoutes);
app.use('/api/home', homeRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/legal", legalRoutes);
app.use("/api/auth", authRoutes)
app.use('/api/musicBlog', musicBlogRoutes);
app.use('/api/musicContact', musicContactRoutes);
app.use('/api/musicCompliance', musicComplianceRoutes)
app.use('/api/testimonial', testimonialRoutes);
app.use('/api/musicMedia', musicMediaRoutes);
app.use('/api/musicPartner', musicPartnersRoutes);


app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
});