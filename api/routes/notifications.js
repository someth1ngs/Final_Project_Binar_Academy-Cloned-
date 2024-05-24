const express = require("express");
const { addNotification, getNotification, markAsRead } = require("../libs/notification");
const router = express.Router();

router.post("/", addNotification);
router.get("/:user_id", getNotification);
router.get("/:id/read", markAsRead);

module.exports = router;