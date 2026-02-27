const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = require("../middleware/upload");
const {
  createProject,
  getProjects,
  deleteProject,
} = require("../controllers/projectController");

router.post("/", upload.single("image"), createProject);
router.get("/", getProjects);
router.delete("/:id", deleteProject);

module.exports = router;
