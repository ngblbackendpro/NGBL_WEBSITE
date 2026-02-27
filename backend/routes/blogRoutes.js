const express = require("express");
const router = express.Router();
const upload = require('../middleware/upload');

const {
  createBlog,
  getBlogs,
  getSingleBlog,
  deleteBlog
} = require("../controllers/blogController");

router.post('/', upload.single('image'), createBlog);
router.get("/", getBlogs);
router.delete("/:id", deleteBlog);
router.get("/:id", getSingleBlog);


module.exports = router;
