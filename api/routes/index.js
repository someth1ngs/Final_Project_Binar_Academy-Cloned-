const express = require("express");
const router = express.Router();
const authRoute = require("./auth");
const profileRoute = require("./profile");

/* GET home page. */
router.use("/auth", authRoute);
router.use("/profile", profileRoute)

module.exports = router;
