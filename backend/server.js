const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
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
const port = process.env.PORT || 5000;;
const connectDB = require("./config/db");


connectDB();


const allowedOrigins = [
  process.env.WEBSITE_URL || "https://ngbl.in",
  process.env.ADMIN_URL || "https://adminpanel.ngbl.in",
  "http://localhost:5000",  // optional for local testing
  "http://localhost:5500"
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


app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
});