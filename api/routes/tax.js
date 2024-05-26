const express = require("express");
const { getTax } = require("../controllers/tax.controller");
const router = express.Router();

router.get("/", getTax)

module.exports = router;