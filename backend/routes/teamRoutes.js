const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload"); // ✅ centralized multer

const {
  createMember,
  getMembers,
  deleteMember
} = require("../controllers/teamController");

// ================= ROUTES =================

// CREATE MEMBER
router.post("/", upload.single("image"), createMember);

// GET MEMBERS
router.get("/", getMembers);

// DELETE MEMBER
router.delete("/:id", deleteMember);

module.exports = router;