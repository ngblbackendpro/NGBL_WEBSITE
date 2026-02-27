const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contactController");

router.post("/", contactController.createContact);
router.get("/notifications", contactController.getUnreadNotifications);
router.put("/notifications/read/:id", contactController.markNotificationsAsRead);
router.get("/download", contactController.downloadContacts);
module.exports = router;