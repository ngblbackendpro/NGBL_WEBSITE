const express = require("express");
const router = express.Router();
const {
  createBrand,
  getAllBrands,
  deleteBrand
} = require("../controllers/brandController");

const multer = require("multer");

/* ===============================
   Multer Config
================================ */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

router.post("/", upload.single("image"), createBrand);
router.get("/", getAllBrands);
router.delete("/:id", deleteBrand);

module.exports = router;
