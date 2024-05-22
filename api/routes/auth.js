const express = require("express");
const { getUser, addUser, login, register, sendVerify, verifyEmail } = require("../controllers/auth.controller");
const router = express.Router();

/* GET users listing. */
router.get("/", getUser);
router.post("/", addUser);
router.post("/login", login); // add router login
router.post("/register", register);
router.post("/verify/send", sendVerify);
router.put("/verify/:token", verifyEmail);

module.exports = router;
