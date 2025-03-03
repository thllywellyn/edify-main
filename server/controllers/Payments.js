const { instance } = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const { courseEnrollmentEmail } = require("../mail/templates/courseEnrollmentEmail");
const { paymentSuccessEmail } = require("../mail/templates/paymentSuccessEmail");
const mongoose = require("mongoose");
const crypto = require("crypto");
const CourseProgress = require("../models/CourseProgress");

// Initiate Razorpay Order
exports.capturePayment = async (req, res) => {
    try {
        const { courses } = req.body;
        const userId = req.user.id;

        if (!courses || courses.length === 0) {
            return res.status(400).json({ success: false, message: "Please provide Course IDs" });
        }

        // Fetch all course details in a single query
        const courseDetails = await Course.find({ _id: { $in: courses } });

        if (courseDetails.length !== courses.length) {
            return res.status(404).json({ success: false, message: "One or more courses not found" });
        }

        // Check if user is already enrolled in any of the selected courses
        for (const course of courseDetails) {
            if (course.studentsEnrolled.includes(userId)) {
                return res.status(400).json({ success: false, message: `Already enrolled in ${course.courseName}` });
            }
        }

        // Calculate total price
        const totalAmount = courseDetails.reduce((sum, course) => sum + course.price, 0);

        // Create order in Razorpay
        const options = {
            amount: totalAmount * 100, // Convert to paise
            currency: "INR",
            receipt: Date.now().toString(),
        };

        const paymentResponse = await instance.orders.create(options);

        return res.status(200).json({
            success: true,
            message: "Order created successfully",
            paymentResponse,
        });
    } catch (error) {
        console.error("Error capturing payment:", error);
        return res.status(500).json({ success: false, message: "Could not initiate order", error: error.message });
    }
};

// Verify Payment
exports.verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, courses } = req.body;
        const userId = req.user.id;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !courses || !userId) {
            return res.status(400).json({ success: false, message: "Invalid payment data" });
        }

        // Generate expected signature
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_SECRET)
            .update(body.toString())
            .digest("hex");

        if (expectedSignature === razorpay_signature) {
            // Enroll student in courses
            await enrollStudents(courses, userId);
            return res.status(200).json({ success: true, message: "Payment verified and student enrolled" });
        } else {
            return res.status(400).json({ success: false, message: "Payment verification failed" });
        }
    } catch (error) {
        console.error("Error verifying payment:", error);
        return res.status(500).json({ success: false, message: "Payment verification failed", error: error.message });
    }
};

// Enroll Students in Courses
const enrollStudents = async (courses, userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) throw new Error("User not found");

        // Enroll student in each course
        for (const courseId of courses) {
            const course = await Course.findByIdAndUpdate(
                courseId,
                { $push: { studentsEnrolled: userId } },
                { new: true }
            );

            if (!course) throw new Error(`Course not found: ${courseId}`);

            // Create course progress entry
            const courseProgress = await CourseProgress.create({
                courseID: courseId,
                userId: userId,
                completedVideos: [],
            });

            // Update user with enrolled course and progress
            await User.findByIdAndUpdate(userId, {
                $push: { courses: courseId, courseProgress: courseProgress._id },
            });

            // Send confirmation email
            await mailSender(
                user.email,
                `Successfully Enrolled into ${course.courseName}`,
                courseEnrollmentEmail(course.courseName, user.firstName)
            );
        }
    } catch (error) {
        console.error("Error enrolling students:", error);
        throw new Error(error.message);
    }
};

// Send Payment Success Email
exports.sendPaymentSuccessEmail = async (req, res) => {
    try {
        const { orderId, paymentId, amount } = req.body;
        const userId = req.user.id;

        if (!orderId || !paymentId || !amount || !userId) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        await mailSender(
            user.email,
            "Payment Received",
            paymentSuccessEmail(user.firstName, amount / 100, orderId, paymentId)
        );

        return res.status(200).json({ success: true, message: "Payment confirmation email sent" });
    } catch (error) {
        console.error("Error sending payment success email:", error);
        return res.status(500).json({ success: false, message: "Could not send email" });
    }
};

// Verify Razorpay Signature from Webhook
exports.verifySignature = async (req, res) => {
    try {
        const webhookSecret = process.env.WEBHOOK_SECRET;
        const signature = req.headers["x-razorpay-signature"];

        const shasum = crypto.createHmac("sha256", webhookSecret);
        shasum.update(JSON.stringify(req.body));
        const digest = shasum.digest("hex");

        if (signature === digest) {
            console.log("Payment is Authorized");

            const { courseId, userId } = req.body.payload.payment.entity.notes;

            // Enroll the student in the course
            await enrollStudents([courseId], userId);

            return res.status(200).json({
                success: true,
                message: "Signature Verified and Course Added",
            });
        } else {
            return res.status(400).json({
                success: false,
                message: "Invalid request signature",
            });
        }
    } catch (error) {
        console.error("Error verifying webhook signature:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};
