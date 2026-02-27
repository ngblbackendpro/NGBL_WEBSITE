const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const {
  createService,
  getServices,
  deleteService
} = require("../controllers/serviceController");

router.post("/", upload.single("image"), createService);
router.get("/", getServices);
router.delete("/:id", deleteService);

module.exports = router;
