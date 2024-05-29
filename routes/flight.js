const express = require("express");
const { middleware } = require("../middleware/middleware");
const { getFlights, getFlightById, getFavoriteDestination } = require("../controllers/flight");
const router = express.Router();

router.get("/", getFlights);
router.get("/favorite", getFavoriteDestination);
router.get("/:id", getFlightById);

module.exports = router;
