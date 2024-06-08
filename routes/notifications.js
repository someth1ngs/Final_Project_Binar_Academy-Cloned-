const express = require("express");
const { middleware, isUser } = require("../middleware/middleware");
const { getNotification, markAsRead } = require("../controllers/notification.controller");
const router = express.Router();

router.get("/", middleware, isUser, getNotification);
router.put("/read", middleware, isUser, markAsRead);

module.exports = router;