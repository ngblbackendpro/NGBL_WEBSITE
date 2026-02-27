const Project = require("../models/Project");

/* =============================
   CREATE PROJECT
============================= */
exports.createProject = async (req, res) => {
  try {
    const { title, heading, description, date, link, status } = req.body;

    const project = await Project.create({
      title,
      heading,
      description,
      date,
      link,
      status,
      image: req.file ? req.file.path.replace(/\\/g, "/") : null,
    });

    res.status(201).json({
      success: true,
      project,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =============================
   GET ALL PROJECTS
============================= */
exports.getProjects = async (req, res) => {
  try {
    const { status } = req.query;

    let filter = {};
    if (status) filter.status = status;

    const projects = await Project.find(filter).sort({ createdAt: -1 });

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =============================
   DELETE PROJECT
============================= */
exports.deleteProject = async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
