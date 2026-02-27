const Project = require("../models/Project");
const Blog = require("../models/Blog");
const Review = require("../models/Review");
const Service = require("../models/Service");
const Contact = require("../models/Contact");
const Home = require("../models/Home");

exports.getDashboardStats = async (req, res) => {
    try {
        const home = await Home.findOne();

        const stats = {
            expYears: home?.expYears || 0,
            projectCount: await Project.countDocuments(),
            blogCount: await Blog.countDocuments(),
            reviewCount: await Review.countDocuments(),
            serviceCount: await Service.countDocuments(),
            contactCount: await Contact.countDocuments(),
            officeCount: home?.offices?.length || 0
        };

        res.json(stats);

    } catch (error) {
        console.error("Dashboard Stats Error:", error);
        res.status(500).json({ message: "Error loading dashboard stats" });
    }
};