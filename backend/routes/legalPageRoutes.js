const express = require("express");
const router = express.Router();
const {
  getLegalPage,
  saveLegalPage
} = require("../controllers/legalPageController");

// GET
router.get("/:type", getLegalPage);

// SAVE
router.put("/:type", saveLegalPage);

module.exports = router;