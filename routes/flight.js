const express = require("express");
const { middleware } = require("../middleware/middleware");
const { getFlights, getFlightById, getFavoriteDestination } = require("../controllers/flight.controller");
const { GenerateFlight } = require("../prisma/seeders/flight-seed");
const router = express.Router();

router.get("/", getFlights);
router.get("/favorite", getFavoriteDestination);
router.post("/generate-flight", async (req, res) => {
  try {
    const generateFlight = await GenerateFlight();
    console.log(generateFlight);
    return res.status(200).json({
      status: true,
      message: "OK",
      data: null,
    });
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      status: true,
      message: "OK",
      data: null,
    });
  }
});
router.get("/:id", getFlightById);

module.exports = router;
