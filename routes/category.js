const express = require("express");
const { getCategory, getCategoryById } = require("../controllers/category.controller");
const router = express.Router();

router.get("/", getCategory);
router.get("/:id", getCategoryById);

module.exports = router;