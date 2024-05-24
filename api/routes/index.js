const express = require("express");
const router = express.Router();
const authRoute = require("./auth");
const notifRoute = require("./notifications");

/* GET home page. */
router.use("/auth", authRoute);
router.use("/notification", notifRoute);

module.exports = router;
