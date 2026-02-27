const Review = require("../models/Review");

// ================= CREATE REVIEW =================
exports.createReview = async (req, res) => {
  try {
    const { name, title, description, rating, email } = req.body;

    const review = new Review({
      name,
      title,
      description,
      rating,
      email,
      image: req.file ? req.file.path : null,
    });

    await review.save();

    res.status(201).json({
      success: true,
      review,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ================= GET ALL REVIEWS =================
exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ================= DELETE REVIEW =================
exports.deleteReview = async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
