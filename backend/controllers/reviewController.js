const Review = require("../models/Review");
const cloudinary = require("../config/cloudinary");

// ================= CREATE REVIEW =================
exports.createReview = async (req, res) => {
  try {
    const { name, title, description, rating, email } = req.body;

    let imageUrl = null;
    let imagePublicId = null;

    // ✅ Upload to Cloudinary
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "reviews" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });

      imageUrl = result.secure_url;
      imagePublicId = result.public_id;
    }

    const review = new Review({
      name,
      title,
      description,
      rating,
      email,
      image: imageUrl,
      imagePublicId: imagePublicId, // ✅ important
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
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // ✅ Delete from Cloudinary
    if (review.imagePublicId) {
      await cloudinary.uploader.destroy(review.imagePublicId);
    }

    // ✅ Delete from DB
    await Review.findByIdAndDelete(req.params.id);

    res.json({ success: true });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
