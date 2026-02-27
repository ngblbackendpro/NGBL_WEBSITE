const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = require("../middleware/upload");

const {
  createMember,
  getMembers,
  deleteMember
} = require("../controllers/teamController");

router.post("/", upload.single("image"), createMember);
router.get("/", getMembers);
router.delete("/:id", deleteMember);


module.exports = router;
