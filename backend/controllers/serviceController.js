const Service = require("../models/Service");

// CREATE SERVICE
exports.createService = async (req, res) => {
  try {
    const { title, description, price, duration, keywords, category } = req.body;

    
      const keywordsArray = keywords
      ? keywords
          .split(/[,\s]+/)   // split by comma OR space
          .map(k => k.trim())
          .filter(k => k.length > 0)
      : [];


    const newService = new Service({
      title,
      description,
      price,
      duration,
      keywords: keywordsArray,
      category,
      image: req.file ? `/uploads/${req.file.filename}` : null
    });

    await newService.save();

    res.status(201).json({ message: "Service created successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create service" });
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
    await Service.findByIdAndDelete(req.params.id);
    res.json({ message: "Service deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete service" });
  }
};
