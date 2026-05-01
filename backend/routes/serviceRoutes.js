const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload"); // ✅ already using memoryStorage here

const {
  createService,
  getServices,
  updateServices,
  deleteService
} = require("../controllers/serviceController");

// ✅ ROUTES
router.post("/", upload.single("image"), createService);
router.get("/", getServices);
router.delete("/:id", deleteService);
router.put('/:id', upload.single('image'), updateServices);

module.exports = router;