const express = require("express");
const { middleware } = require("../middleware/middleware");
const { getAirports, getAirportByIdCode } = require("../controllers/airport.controller");
const router = express.Router();

router.get("/", getAirports);
router.get("/:id_code", getAirportByIdCode);

module.exports = router;
