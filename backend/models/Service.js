const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  serviceDepartment: {
    type: String,
    enum: ["IT", "Music"],
    required: true
  },
  price: { type: String },
  duration: { type: Number },
  keywords: {
  type: [String], default: []},
  category: { type: String, default: "all" },
  image: { type: String },
  imagePublicId: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Service", serviceSchema);
