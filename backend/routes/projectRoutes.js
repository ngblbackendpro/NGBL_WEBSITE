const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload"); // ✅ centralized multer

const {
  createProject,
  getProjects,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");

// ================= ROUTES =================

// CREATE PROJECT
router.post("/", upload.single("image"), createProject);

// GET PROJECTS
router.get("/", getProjects);

router.put('/:id', upload.single('image'), updateProject);

// DELETE PROJECT
router.delete("/:id", deleteProject);

module.exports = router;