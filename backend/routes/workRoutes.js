const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload"); // ✅ use common multer

const {
  addWork,
  getAllWorks,
  deleteWork
} = require("../controllers/workController");

// CREATE WORK
router.post("/", upload.single("image"), addWork);

// GET ALL WORKS
router.get("/", getAllWorks);

// DELETE WORK
router.delete("/:id", deleteWork);

module.exports = router;