const express = require("express");
const { middleware } = require("../middleware/middleware");
const { getPlanes, getPlaneByIdCode } = require("../controllers/plane.controller");
const router = express.Router();

router.get("/", getPlanes);
router.get("/:id_code", getPlaneByIdCode);

module.exports = router;
