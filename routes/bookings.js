const express = require("express");
const router = express.Router();
const { createBookings, getBookings, getBookingsById } = require("../controllers/bookings.controller");
const { middleware, isUser } = require("../middleware/middleware");

router.post("/", middleware, isUser, createBookings);
router.get("/", middleware, isUser, getBookings);
router.get("/:id", middleware, isUser, getBookingsById);
module.exports = router;