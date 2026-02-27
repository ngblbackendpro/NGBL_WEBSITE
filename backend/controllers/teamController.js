const Team = require("../models/Team");

// CREATE MEMBER
exports.createMember = async (req, res) => {
  try {
    const { name, position, description, email, phone, linkedin } = req.body;

    const newMember = new Team({
      name,
      position,
      description,
      email,
      phone,
      linkedin,
      image: req.file ? req.file.filename : null
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
    await Team.findByIdAndDelete(req.params.id);
    res.json({ message: "Team member deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
