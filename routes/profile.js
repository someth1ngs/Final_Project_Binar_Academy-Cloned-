const express = require("express");
const { getProfile, editProfile } = require("../controllers/profile.controller");
const { middleware, isUser } = require("../middleware/middleware")
const router = express.Router();

router.get("/", middleware, isUser, getProfile)
router.put("/", middleware, isUser, editProfile)

module.exports = router;