const express = require("express");
const router = express.Router();
const {
  addWork,
  getAllWorks,
  deleteWork
} = require("../controllers/workController");

const multer = require("multer");

/* ===============================
   Multer Config
================================ */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // same uploads folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

// Routes
router.post("/", upload.single("image"), addWork);
router.get("/", getAllWorks);
router.delete("/:id", deleteWork);

module.exports = router;
