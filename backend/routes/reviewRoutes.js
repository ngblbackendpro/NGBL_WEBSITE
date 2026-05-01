const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const upload = require("../middleware/upload"); // ✅ FIX

router.post("/", upload.single("image"), reviewController.createReview);
router.get("/", reviewController.getReviews);
router.put("/:id", upload.single("image"), reviewController.updateReviews);
router.delete("/:id", reviewController.deleteReview);

module.exports = router;