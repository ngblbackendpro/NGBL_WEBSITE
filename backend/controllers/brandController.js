const Brand = require("../models/Brand");
const cloudinary = require("../config/cloudinary");

/* ===============================
   CREATE BRAND
================================ */
exports.createBrand = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Brand image is required" });
    }

    // ✅ upload to cloudinary
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "brands" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });

    const brand = new Brand({
      name,
      description,
      image: result.secure_url   // ✅ SAVE URL
    });

    await brand.save();

    res.status(201).json({
      success: true,
      message: "Brand added successfully",
      brand
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};


/* ===============================
   GET ALL BRANDS
================================ */
exports.getAllBrands = async (req, res) => {
  try {
    const brands = await Brand.find().sort({ createdAt: -1 });
    res.json(brands);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};


/* ===============================
   DELETE BRAND
================================ */
exports.deleteBrand = async (req, res) => {
  try {
    await Brand.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Brand deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
