const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      default: ""
    },
    image: {
      type: String, // will store image path like: uploads/brand-123.png
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Brand", brandSchema);
