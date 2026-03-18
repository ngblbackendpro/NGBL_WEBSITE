const express = require("express");
const router = express.Router();
const multer = require("multer");
const reviewController = require("../controllers/reviewController");

// ===== Multer Config =====
const storage = multer.memoryStorage();

const upload = multer({ storage });

// ===== Routes =====
router.post("/", upload.single("image"), reviewController.createReview);

router.get("/", reviewController.getReviews);

router.delete("/:id", reviewController.deleteReview);

module.exports = router;
