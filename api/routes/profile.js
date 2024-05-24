const express = require("express");
const { getProfile, editProfile } = require("../controllers/profile.controller");
const { middleware } = require("../middleware/middleware")
const router = express.Router();

router.get("/:user_id", getProfile)
router.put("/:user_id", middleware, editProfile)

module.exports = router;