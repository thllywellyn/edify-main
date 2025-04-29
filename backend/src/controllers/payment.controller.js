import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { student } from "../models/student.model.js";
import { Teacher } from "../models/teacher.model.js";
import { course } from "../models/course.model.js";
import { Sendmail } from "../utils/Nodemailer.js";

const coursePayment = asyncHandler(async (req, res) => {
  const { courseID } = req.params;
  // For demo purposes, we'll just create a fake order ID
  const orderId = "demo_order_" + Date.now();
  
  return res
    .status(200)
    .json(new ApiResponse(200, { id: orderId }, "Order created successfully"));
});

const getkey = asyncHandler(async (req, res) => {
  // For demo purposes, return a dummy key
  return res
    .status(200)
    .json(new ApiResponse(200, { key: "dummy_key" }, "Key fetched"));
});

const coursePaymentConfirmation = asyncHandler(async (req, res) => {
  const { courseID } = req.params;
  const loggedStudent = req.Student;

  // Skip payment verification for demo
  // Update course enrollment
  const Course = await course.findByIdAndUpdate(
    courseID,
    {
      $addToSet: { enrolledStudent: loggedStudent._id }
    },
    { new: true }
  );

  if (!Course) {
    throw new ApiError(404, "Course not found");
  }

  // Send confirmation email
  await Sendmail(loggedStudent.Email, `Payment Confirmation for Course Purchase`, 
    `<html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h1 style="color: #4CAF50; text-align: center;">Payment Successful!</h1>
        <p style="font-size: 16px; text-align: center;">Dear ${loggedStudent.Firstname},</p>
        <p style="font-size: 16px; text-align: center;">We are pleased to inform you that your payment for the course has been successfully processed.</p>
         <p style="font-size: 16px;">You can start accessing the course immediately by logging into your account.</p>
        <p style="font-size: 16px;">Best regards,</p>
        <p style="font-size: 16px;"><strong>The Edify Team</strong></p>
        <p style="font-size: 14px;">&copy; 2024 Edify. All rights reserved.</p>
        </body>
    </html>`
  );

  // Update teacher's balance
  const teacher = await Teacher.findByIdAndUpdate(
    Course.enrolledteacher,
    {
      $inc: { Balance: Course.price }
    },
    { new: true }
  );

  if (!teacher) {
    throw new ApiError(404, "Teacher not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { Course }, "Payment successful"));
});

const teacherAmount = asyncHandler(async (req, res) => {
  const { teacherID } = req.params;

  const teacher = await Teacher.findById(teacherID);
  if (!teacher) {
    throw new ApiError(404, "Teacher not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { balance: teacher.Balance }, "Balance fetched successfully"));
});

const withdrawAmount = asyncHandler(async (req, res) => {
  const { teacherID } = req.params;
  const { amount } = req.body;

  if (!amount || amount <= 0) {
    throw new ApiError(400, "Invalid withdrawal amount");
  }

  const teacher = await Teacher.findById(teacherID);
  if (!teacher) {
    throw new ApiError(404, "Teacher not found");
  }

  if (teacher.Balance < amount) {
    throw new ApiError(400, "Insufficient balance");
  }

  // Update teacher's balance and add to withdrawal history
  const updatedTeacher = await Teacher.findByIdAndUpdate(
    teacherID,
    {
      $inc: { Balance: -amount },
      $push: {
        WithdrawalHistory: {
          amount,
          date: new Date()
        }
      }
    },
    { new: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, { 
      newBalance: updatedTeacher.Balance,
      withdrawal: updatedTeacher.WithdrawalHistory[updatedTeacher.WithdrawalHistory.length - 1]
    }, "Withdrawal successful"));
});

export {
  coursePayment,
  getkey,
  coursePaymentConfirmation,
  teacherAmount,
  withdrawAmount
};