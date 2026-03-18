const Service = require("../models/Service");
const cloudinary = require("../config/cloudinary");

// CREATE SERVICE
exports.createService = async (req, res) => {
  try {
    const { title, description, price, duration, keywords, category } = req.body;

    const keywordsArray = keywords
      ? keywords
          .split(/[,\s]+/)
          .map(k => k.trim())
          .filter(k => k.length > 0)
      : [];

    let imageUrl = null;
    let imagePublicId = null;

    // ✅ Correct way
    if (req.file) {
      imageUrl = req.file.path;
      imagePublicId = req.file.filename;
    }

    const newService = new Service({
      title,
      description,
      price,
      duration,
      keywords: keywordsArray,
      category,
      image: imageUrl,
      imagePublicId: imagePublicId,
    });

    await newService.save();

    res.status(201).json({ message: "Service created successfully" });

  } catch (error) {
    console.error("SERVICE ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};

// GET ALL SERVICES
exports.getServices = async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch services" });
  }
};

// DELETE SERVICE
exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ error: "Service not found" });
    }

    // ✅ Delete from Cloudinary
    if (service.imagePublicId) {
      await cloudinary.uploader.destroy(service.imagePublicId);
    }

    // ✅ Delete from DB
    await Service.findByIdAndDelete(req.params.id);

    res.json({ message: "Service + image deleted successfully" });

  } catch (error) {
    res.status(500).json({ error: "Failed to delete service" });
  }
};
