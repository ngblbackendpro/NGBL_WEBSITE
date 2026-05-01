const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload"); // ✅ centralized multer (memoryStorage)

const {
  createBrand,
  getAllBrands,
  updateBrand,
  deleteBrand
} = require("../controllers/brandController");

// ================= ROUTES =================

// CREATE BRAND
router.post("/", upload.single("image"), createBrand);

// GET ALL BRANDS
router.get("/", getAllBrands);

router.put("/:id", upload.single("image"), updateBrand);

// DELETE BRAND
router.delete("/:id", deleteBrand);

module.exports = router;