const express = require("express");
const { getUser, register } = require("../controllers/auth.controller");
const router = express.Router();

/* GET users listing. */
router.get("/", getUser);
router.post("/register", register);

module.exports = router;
