const express = require("express");
const { middleware, isUser } = require("../middleware/middleware");
const { updatePayment } = require("../controllers/payment.controller");
const router = express.Router();

router.put("/:payment_id", updatePayment);

module.exports = router;
