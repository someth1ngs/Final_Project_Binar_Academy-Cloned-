const express = require("express");
const { getNotification, markAsRead } = require("../controllers/notification.controller");
const router = express.Router();

router.get("/:user_id", getNotification);
router.get("/:user_id/read", markAsRead);

module.exports = router;