const Work = require("../models/Work");

/* ===============================
   ADD WORK
================================ */
exports.addWork = async (req, res) => {
  try {
    const { title, category, description, link } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Work image is required" });
    }

    const work = new Work({
      title,
      category,
      description,
      link,
      image: req.file.path // save uploaded image path
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
    await Work.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Work deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
