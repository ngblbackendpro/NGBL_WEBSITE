const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload"); // ✅ centralized multer

const {
  createProject,
  getProjects,
  deleteProject,
} = require("../controllers/projectController");

// ================= ROUTES =================

// CREATE PROJECT
router.post("/", upload.single("image"), createProject);

// GET PROJECTS
router.get("/", getProjects);

// DELETE PROJECT
router.delete("/:id", deleteProject);

module.exports = router;