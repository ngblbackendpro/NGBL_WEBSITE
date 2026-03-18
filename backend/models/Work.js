const mongoose = require("mongoose");

const workSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    link: { type: String },
    imagePublicId: {
      type: String,
    },
    image: { type: String, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Work", workSchema);
