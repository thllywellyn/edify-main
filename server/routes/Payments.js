const express = require("express");
const router = express.Router();

const { auth, isInstructor, isStudent, isAdmin } = require("../middlewares/auth");
const paymentsController = require("../controllers/Payments");
router.post("/capturePayment", auth, isStudent, paymentsController.capturePayment);
router.post("/verifyPayment", auth, isStudent, paymentsController.verifyPayment);
router.post("/sendPaymentSuccessEmail", auth, isStudent, paymentsController.sendPaymentSuccessEmail);

module.exports = router;
