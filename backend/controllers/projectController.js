const Project = require("../models/Project");
const cloudinary = require("../config/cloudinary");

/* =============================
   CREATE PROJECT
============================= */
exports.createProject = async (req, res) => {
  try {
    const { title, heading, description, date, link, status } = req.body;

    let imageUrl = null;
    let imagePublicId = null;

    // ✅ Upload to Cloudinary
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "projects" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });

      imageUrl = result.secure_url;
      imagePublicId = result.public_id;
    }

    const project = await Project.create({
      title,
      heading,
      description,
      date,
      link,
      status,
      image: imageUrl,
      imagePublicId: imagePublicId,
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
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // ✅ Delete image from Cloudinary
    if (project.imagePublicId) {
      await cloudinary.uploader.destroy(project.imagePublicId);
    }

    // ✅ Delete from DB
    await Project.findByIdAndDelete(req.params.id);

    res.json({ message: "Project + image deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
