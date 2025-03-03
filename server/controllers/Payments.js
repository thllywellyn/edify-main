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
        await sendPaymentSuccessEmail(userId, razorpay_order_id, razorpay_payment_id, courses);

        return res.status(200).json({ success: true, message: "Payment verified and enrolled" });
    } catch (error) {
        console.error("Error verifying payment:", error);
        return res.status(500).json({ success: false, message: "Payment verification failed" });
    }
};

// Enroll Students
const enrollStudents = async (courses, userId) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        for (const courseId of courses) {
            const enrolledCourse = await Course.findByIdAndUpdate(
                courseId,
                { $addToSet: { studentsEnrolled: userId } },
                { new: true, session }
            );

            if (!enrolledCourse) throw new Error(`Course not found: ${courseId}`);

            const courseProgress = await CourseProgress.create([{ 
                courseID: courseId, 
                userId, 
                completedVideos: [] 
            }], { session });

            await User.findByIdAndUpdate(userId, {
                $addToSet: { courses: courseId, courseProgress: courseProgress[0]._id },
            }, { session });

            await sendEnrollmentEmail(userId, enrolledCourse.courseName);
        }

        await session.commitTransaction();
        session.endSession();
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error("Error enrolling students:", error);
        throw error;
    }
};

// Send Enrollment Email
const sendEnrollmentEmail = async (userId, courseName) => {
    try {
        const user = await User.findById(userId);
        if (!user) throw new Error("User not found");

        await mailSender(
            user.email,
            `Successfully Enrolled in ${courseName}`,
            courseEnrollmentEmail(courseName, user.firstName)
        );

        console.log(`Enrollment email sent to ${user.email}`);
    } catch (error) {
        console.error("Error sending enrollment email:", error);
    }
};

// Send Payment Success Email
const sendPaymentSuccessEmail = async (userId, orderId, paymentId, courses) => {
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

// Verify Razorpay Signature (Webhook)
exports.verifySignature = async (req, res) => {
    try {
        const webhookSecret = "12345678";
        const signature = req.headers["x-razorpay-signature"];

        const shasum = crypto.createHmac("sha256", webhookSecret);
        shasum.update(JSON.stringify(req.body));
        const digest = shasum.digest("hex");

        if (signature !== digest) {
            return res.status(400).json({ success: false, message: "Invalid signature" });
        }

        console.log("Payment Authorized");

        const { courseId, userId } = req.body.payload.payment.entity.notes;

        const enrolledCourse = await Course.findByIdAndUpdate(
            courseId,
            { $addToSet: { studentsEnrolled: userId } },
            { new: true }
        );

        if (!enrolledCourse) {
            return res.status(500).json({ success: false, message: "Course not found" });
        }

        await User.findByIdAndUpdate(userId, { $addToSet: { courses: courseId } });

        await mailSender(
            enrolledCourse.email,
            "Congratulations from CodeHelp",
            "Congratulations, you are onboarded into a new CodeHelp Course"
        );

        return res.status(200).json({ success: true, message: "Signature verified and course added" });
    } catch (error) {
        console.error("Error verifying signature:", error);
        return res.status(500).json({ success: false, message: "Signature verification failed" });
    }
};
