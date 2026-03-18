const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  position: { type: String, required: true },
  description: { type: String, required: true },
  imagePublicId: {
    type: String,
  },
  email: String,
  phone: String,
  linkedin: String,
  image: String
}, { timestamps: true });

module.exports = mongoose.model("Team", teamSchema);
