const express = require("express");
const router = express.Router();

const upload = require('../middleware/upload');

const {
  createBlog,
  getBlogs,
  getSingleBlog,
  deleteBlog
} = require("../controllers/blogController");

// ✅ ROUTES
router.post('/', upload.single('image'), createBlog);
router.get("/", getBlogs);
router.get("/:id", getSingleBlog);
router.delete("/:id", deleteBlog);

module.exports = router;