const express = require("express");
const router = express.Router();

// Ensure the correct file path (check for case sensitivity in the filename)
const { capturePayment, verifyPayment, sendPaymentSuccessEmail } = require("../controllers/Payments");

const { auth, isInstructor, isStudent, isAdmin } = require("../middlewares/auth");

// Define payment routes
router.post("/capturePayment", auth, isStudent, capturePayment);
router.post("/verifyPayment", auth, isStudent, verifyPayment);
router.post("/sendPaymentSuccessEmail", auth, isStudent, sendPaymentSuccessEmail);

module.exports = router;
