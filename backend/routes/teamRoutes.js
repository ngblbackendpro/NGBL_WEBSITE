const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload"); // ✅ centralized multer

const {
  createMember,
  getMembers,
  deleteMember,
  updateMember
} = require("../controllers/teamController");

// ================= ROUTES =================

// CREATE MEMBER
// router.post("/", upload.single("image"), createMember);
router.post("/", (req, res, next) => {
    upload.single("image")(req, res, (err) => {
        if (err) {
            console.error("MULTER ERROR:", err.message);
            return res.status(500).json({ error: err.message });
        }
        next();
    });
}, createMember);

// GET MEMBERS
router.get("/", getMembers);

//update member
router.put('/:id', upload.single('image'), updateMember);

// DELETE MEMBER
router.delete("/:id", deleteMember);

module.exports = router;