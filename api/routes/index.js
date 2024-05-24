const express = require("express");
const router = express.Router();
const authRoute = require("./auth");
<<<<<<< HEAD
const notifRoute = require("./notifications");

/* GET home page. */
router.use("/auth", authRoute);
router.use("/notification", notifRoute);
=======
const profileRoute = require("./profile");

/* GET home page. */
router.use("/auth", authRoute);
router.use("/profile", profileRoute)
>>>>>>> 5c8f6a58fa2eea33edccc3ad3905a15b6bad0366

module.exports = router;
