const express = require("express");
const router = express.Router();
const authRoute = require("./auth");
const notifRoute = require("./notifications");
const profileRoute = require("./profile");
const planeRoute = require("./plane");
const airportRoute = require("./airport");

/* GET home page. */
router.use("/auth", authRoute);
router.use("/notification", notifRoute);
router.use("/profile", profileRoute);
router.use("/plane", planeRoute);
router.use("/airport", airportRoute);

module.exports = router;
