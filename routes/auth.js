const express = require("express");
const { getUser, addUser } = require("../controllers/auth.controller");
const router = express.Router();

/* GET users listing. */
router.get("/", getUser);
router.post("/", addUser);

module.exports = router;
