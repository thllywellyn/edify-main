const { instance } = require("../config/razorpay");
const mongoose = require("mongoose");
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const { courseEnrollmentEmail } = require("../mail/templates/courseEnrollmentEmail");
const { paymentSuccessEmail } = require("../mail/templates/paymentSuccessEmail");
const CourseProgress = require("../models/CourseProgress");
const crypto = require("crypto");

// Capture Payment (Initiate Razorpay Order)
exports.capturePayment = async (req, res) => {
    try {
        const { courses } = req.body;
        const userId = req.user.id;

        if (!courses || courses.length === 0) {
            return res.status(400).json({ success: false, message: "No courses provided" });
        }

        let totalAmount = 0;

        for (const courseId of courses) {
            const course = await Course.findById(courseId);
            if (!course) {
                return res.status(404).json({ success: false, message: "Course not found" });
            }

            if (course.studentsEnrolled.includes(new mongoose.Types.ObjectId(userId))) {
                return res.status(200).json({ success: false, message: "Already enrolled" });
            }

            totalAmount += course.price;
        }

        const options = {
            amount: totalAmount * 100,
            currency: "INR",
            receipt: Date.now().toString(),
        };

        const paymentResponse = await instance.orders.create(options);
        return res.status(200).json({ success: true, paymentResponse });
    } catch (error) {
        console.error("Error initiating payment:", error);
        return res.status(500).json({ success: false, message: "Could not initiate order" });
    }
};

// Verify Payment
exports.verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, courses } = req.body;
        const userId = req.user.id;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({ success: false, message: "Payment details missing" });
        }

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex");

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({ success: false, message: "Payment verification failed" });
        }

        await enrollStudents(courses, userId);
        await exports.sendPaymentSuccessEmail({ userId, orderId: razorpay_order_id, paymentId: razorpay_payment_id, courses });

        return res.status(200).json({ success: true, message: "Payment verified and enrolled" });
    } catch (error) {
        console.error("Error verifying payment:", error);
        return res.status(500).json({ success: false, message: "Payment verification failed" });
    }
};

// Enroll Students
const enrollStudents = async (courses, userId) => {
    try {
        for (const courseId of courses) {
            const enrolledCourse = await Course.findByIdAndUpdate(
                courseId,
                { $addToSet: { studentsEnrolled: userId } },
                { new: true }
            );

            if (!enrolledCourse) throw new Error(`Course not found: ${courseId}`);

            const courseProgress = await CourseProgress.create({ courseID: courseId, userId, completedVideos: [] });

            await User.findByIdAndUpdate(userId, {
                $addToSet: { courses: courseId, courseProgress: courseProgress._id },
            });
        }
    } catch (error) {
        console.error("Error enrolling students:", error);
        throw error;
    }
};

// Send Payment Success Email
exports.sendPaymentSuccessEmail = async ({ userId, orderId, paymentId, courses }) => {
    try {
        const enrolledStudent = await User.findById(userId);
        if (!enrolledStudent) throw new Error("User not found");

        const totalAmount = await Course.find({ _id: { $in: courses } })
            .then(courses => courses.reduce((sum, course) => sum + course.price, 0));

        await mailSender(
            enrolledStudent.email,
            "Payment Received",
            paymentSuccessEmail(enrolledStudent.firstName, totalAmount / 100, orderId, paymentId)
        );

        console.log(`Payment success email sent to ${enrolledStudent.email}`);
    } catch (error) {
        console.error("Error sending payment success email:", error);
    }
};
