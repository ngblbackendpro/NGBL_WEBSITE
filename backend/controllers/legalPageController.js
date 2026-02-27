const LegalPage = require("../models/LegalPage");

// GET page
exports.getLegalPage = async (req, res) => {
  try {
    const { type } = req.params;

    const page = await LegalPage.findOne({ type });

    if (!page) {
      return res.status(200).json({ content: "" });
    }

    res.status(200).json(page);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE or UPDATE
exports.saveLegalPage = async (req, res) => {
  try {
    const { type } = req.params;
    const { content } = req.body;

    const page = await LegalPage.findOneAndUpdate(
      { type },
      { content },
      { new: true, upsert: true }
    );

    res.status(200).json(page);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};