const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload"); // ✅ already using memoryStorage here

const {
  createService,
  getServices,
  deleteService
} = require("../controllers/serviceController");

// ✅ ROUTES
router.post("/", upload.single("image"), createService);
router.get("/", getServices);
router.delete("/:id", deleteService);

module.exports = router;