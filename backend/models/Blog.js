const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  date: { type: Date, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  content: { type: String, required: true },
  tags: [String],
  image: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Blog", blogSchema);
