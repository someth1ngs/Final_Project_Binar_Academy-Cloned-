const express = require("express");
const { getUser, addUser, login } = require("../controllers/auth.controller");
const router = express.Router();

/* GET users listing. */
router.get("/", getUser);
router.post("/", addUser);
router.post("/login", login); // add router login
router.post("/register", register);

module.exports = router;
