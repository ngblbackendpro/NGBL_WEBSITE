const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    heading: {
      type: String,
      required: true,
    },
    projectDepartment: {
      type: String,
      enum: ["IT", "Music"],
      required: true 
    },
    description: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    link: {
      type: String,
      required: function () {
        return this.status === "completed";
      },
    },
    image: {
      type: String, // store image path
      required: true,
    },
    status: {
      type: String,
      enum: ["upcoming", "completed"],
      required: true,
    },
    imagePublicId: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);
