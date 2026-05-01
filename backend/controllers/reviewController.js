const Review = require("../models/Review");
const cloudinary = require("../config/cloudinary");

// ================= CREATE REVIEW =================
exports.createReview = async (req, res) => {
  try {
    const { name, title, description, rating, email } = req.body;

    let imageUrl = null;
    let imagePublicId = null;

    // ✅ Correct way
    if (req.file) {
      imageUrl = req.file.path;
      imagePublicId = req.file.filename;
    }

    const review = new Review({
      name,
      title,
      description,
      rating,
      email,
      image: imageUrl,
      imagePublicId: imagePublicId,
    });

    await review.save();

    res.status(201).json({
      success: true,
      review,
    });

  } catch (error) {
    console.error("REVIEW ERROR:", error);
    res.status(500).json({ message: error.message });
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


exports.updateReviews = async (req, res) => {
  try{
    const { name, title, description, rating, email } = req.body;

    const review = await Review.findById(req.params.id);
    if(!review){
      return res.status(404).json({message: "review not found"});
    }
    let imageUrl = review.image;
    let imagePublicId = review.imagePublicId;
    
    if(req.file){
      if(review.imagePublicId){
        await cloudinary.uploader.destroy(review.imagePublicId);
      }
      imageUrl = req.file.path;
      imagePublicId = req.file.filename
    }
    
    review.name = name;
    review.title = title;
    review.description = description;
    review.rating = rating;
    review.email = email;
    review.image = imageUrl;
    review.imagePublicId = imagePublicId;
    await review.save();
    res.status(201).json({success: true, review});
  } catch (error) {
    res.status(500).json({message: error.message});
  }
}

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
