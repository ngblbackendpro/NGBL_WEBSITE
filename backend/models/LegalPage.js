const mongoose = require("mongoose");

const legalPageSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["faq", "terms", "privacy"],
    required: true,
    unique: true
  },
  content: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model("LegalPage", legalPageSchema);