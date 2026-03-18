const Work = require("../models/Work");
const cloudinary = require("../config/cloudinary");

/* ===============================
   ADD WORK
================================ */
exports.addWork = async (req, res) => {
  try {
    const { title, category, description, link } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Work image is required" });
    }

    let imageUrl = null;
    let imagePublicId = null;

    // ✅ Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "works" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });

    imageUrl = result.secure_url;
    imagePublicId = result.public_id;

    const work = new Work({
      title,
      category,
      description,
      link,
      image: imageUrl,
      imagePublicId: imagePublicId, // ✅ important
    });

    await work.save();

    res.status(201).json({
      success: true,
      message: "Work added successfully",
      work
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

/* ===============================
   GET ALL WORKS
================================ */
exports.getAllWorks = async (req, res) => {
  try {
    const works = await Work.find().sort({ createdAt: -1 });
    res.json(works);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

/* ===============================
   DELETE WORK
================================ */
exports.deleteWork = async (req, res) => {
  try {
    const work = await Work.findById(req.params.id);

    if (!work) {
      return res.status(404).json({ message: "Work not found" });
    }

    // ✅ Delete image from Cloudinary
    if (work.imagePublicId) {
      await cloudinary.uploader.destroy(work.imagePublicId);
    }

    // ✅ Delete from DB
    await Work.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: "Work + image deleted" });

  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
