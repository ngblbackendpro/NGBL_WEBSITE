const express = require('express');
const router = express.Router()
const authMiddleware = require("../middleware/authMiddleware");
const { loginAdmin, changePassword } = require('../controllers/authController')

router.post('/login', loginAdmin)
router.put("/change-password", authMiddleware, changePassword);

module.exports = router;
