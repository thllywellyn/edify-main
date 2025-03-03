const { instance } = require("../config/razorpay");
const mongoose = require("mongoose"); // Added missing import
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const { courseEnrollmentEmail } = require("../mail/templates/courseEnrollmentEmail");
const CourseProgress = require("../models/CourseProgress");
const crypto = require("crypto");

// Capture Payment
exports.capturePayment = async (req, res) => {
    try {
        const { courses } = req.body;
        const userId = req.user.id;

        if (!courses || courses.length === 0) {
            return res.status(400).json({ success: false, message: "No courses provided" });
        }

        const courseDetails = await Course.find({ _id: { $in: courses } });

        if (courseDetails.length !== courses.length) {
            return res.status(404).json({ success: false, message: "One or more courses not found" });
        }

        const totalAmount = courseDetails.reduce((sum, course) => sum + course.price, 0);
        
        const options = {
            amount: totalAmount * 100,
            currency: "INR",
            receipt: Date.now().toString(),
        };

        const paymentResponse = await instance.orders.create(options);
        return res.status(200).json({ success: true, paymentResponse });
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

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({ success: false, message: "Missing payment details" });
        }

        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET)
            .update(body)
            .digest("hex");

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({ success: false, message: "Payment verification failed" });
        }

        await enrollStudents(courses, userId);
        return res.status(200).json({ success: true, message: "Payment verified and student enrolled" });
    } catch (error) {
        console.error("Error verifying payment:", error);
        return res.status(500).json({ success: false, message: "Payment verification failed", error: error.message });
    }
};

// Enroll Students
const enrollStudents = async (courses, userId) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const user = await User.findById(userId).session(session);
        if (!user) throw new Error("User not found");

        for (const courseId of courses) {
            const course = await Course.findByIdAndUpdate(
                courseId,
                { $addToSet: { studentsEnrolled: userId } }, // Prevent duplicate enrollments
                { new: true, session }
            );
            if (!course) throw new Error(`Course not found: ${courseId}`);

            const courseProgress = await CourseProgress.create([{ 
                courseID: courseId, 
                userId: userId, 
                completedVideos: [] 
            }], { session });

            await User.findByIdAndUpdate(userId, {
                $addToSet: { courses: courseId, courseProgress: courseProgress[0]._id },
            }, { session });

            // Send Enrollment Email
            try {
                await mailSender(
                    user.email,
                    `Successfully Enrolled in ${course.courseName}`,
                    courseEnrollmentEmail(course.courseName, user.firstName)
                );
            } catch (emailError) {
                console.error(`Failed to send enrollment email to ${user.email}:`, emailError);
            }
        }
        
        await session.commitTransaction();
        session.endSession();
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error("Error enrolling students:", error);
        throw new Error(error.message);
    }
};
