const Team = require("../models/Team");
const cloudinary = require("../config/cloudinary");

// CREATE MEMBER
exports.createMember = async (req, res) => {
  try {
    const { name, position, description, email, phone, linkedin } = req.body;

    let imageUrl = null;
    let imagePublicId = null;

    // ✅ multer-storage-cloudinary already uploads
    if (req.file) {
      imageUrl = req.file.path;        // Cloudinary URL
      imagePublicId = req.file.filename; // Public ID
    }

    const newMember = new Team({
      name,
      position,
      description,
      email,
      phone,
      linkedin,
      image: imageUrl,
      imagePublicId: imagePublicId,
    });

    await newMember.save();

    res.status(201).json({ message: "Team member added successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET ALL MEMBERS
exports.getMembers = async (req, res) => {
  try {
    const members = await Team.find().sort({ createdAt: -1 });
    res.json(members);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE MEMBER
exports.deleteMember = async (req, res) => {
  try {
    const member = await Team.findById(req.params.id);

    if (!member) {
      return res.status(404).json({ error: "Member not found" });
    }

    // ✅ Delete from Cloudinary
    if (member.imagePublicId) {
      await cloudinary.uploader.destroy(member.imagePublicId);
    }

    // ✅ Delete from DB
    await Team.findByIdAndDelete(req.params.id);

    res.json({ message: "Team member + image deleted" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
