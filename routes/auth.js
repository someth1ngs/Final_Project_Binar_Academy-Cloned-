const express = require("express");
const { middleware, isAdmin } = require("../middleware/middleware");
const { getUser, addUser, login, register, sendVerify, verifyEmail, forgotPassword, resetPassword, changePassword } = require("../controllers/auth.controller");
const router = express.Router();

/* GET users listing. */
router.get("/", middleware, isAdmin, getUser);
router.post("/", addUser);
router.post("/login", login);
router.post("/register", register);
router.post("/verify/send", sendVerify);
router.put("/verify/:token", verifyEmail);
router.post("/forgotpassword", forgotPassword);
router.post("/resetpassword/:token", resetPassword);
router.put("/changepassword", middleware, changePassword);

module.exports = router;
