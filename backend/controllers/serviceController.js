const Service = require("../models/Service");
const cloudinary = require("../config/cloudinary");

// CREATE SERVICE
exports.createService = async (req, res) => {
  try {
    const { title, description, serviceDepartment, price, duration, keywords, category } = req.body;

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
      serviceDepartment,
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
    const filter = {};
    if (req.query.serviceDepartment) {
      filter.serviceDepartment = req.query.serviceDepartment;
    }
    const services = await Service.find(filter).sort({ createdAt: -1 });
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch services" });
  }
};


exports.updateServices = async (req, res) => {
  try{
    const { title, description, serviceDepartment, price, duration, keywords, category } = req.body;
    const service = await Service.findById(req.params.id);
    if(!service){
      return res.status(404).json({message: "service not exists"});
    }
    let imageUrl = service.image;
    let imagePublicId = service.imagePublicId;
    
    if(req.file){
      if(service.imagePublicId){
        await cloudinary.uploader.destroy(service.imagePublicId);
      }
      imageUrl = req.file.path;
      imagePublicId = req.file.filename;
    }
    service.title = title;
    service.description = description;
    service.serviceDepartment = serviceDepartment;
    service.price = price;
    service.duration = duration;
    service.keywords = keywords;
    service.category = category;
    service.image = imageUrl;
    service.imagePublicId = imagePublicId;

    await service.save();
    res.status(201).json({success: true, service});
  } catch (error) {
    res.status(500).json({message: error.message});
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
