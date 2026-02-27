const express = require("express");
const router = express.Router();
const multer = require("multer");
const reviewController = require("../controllers/reviewController");

// ===== Multer Config =====
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// ===== Routes =====
router.post("/", upload.single("image"), reviewController.createReview);

router.get("/", reviewController.getReviews);

router.delete("/:id", reviewController.deleteReview);

module.exports = router;
