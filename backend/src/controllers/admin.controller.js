import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { admin } from "../models/admin.model.js";
import { student, studentdocs } from "../models/student.model.js";
import { Teacher, Teacherdocs } from "../models/teacher.model.js";
import { contact } from "../models/contact.model.js";
import { course } from "../models/course.model.js";
import { Sendmail } from "../utils/Nodemailer.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { createNotification } from "./notification.controller.js";

// Rate limiting map
const loginAttempts = new Map();
const MAX_ATTEMPTS = 5;
const LOCKOUT_TIME = 30 * 60 * 1000; // 30 minutes

const adminSignUp = asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    if ([username, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    const existedAdmin = await admin.findOne({ username });

    if (existedAdmin) {
        throw new ApiError(400, "admin already exist");
    }

    const newAdmin = await admin.create({
        username,
        password,
    });

    if (!newAdmin) {
        throw new ApiError(400, "failed to add admin");
    }

    return res
        .status(200)
        .json(new ApiResponse(400, {}, "admin added successfully"));
});

const generateAccessAndRefreshTokens = async (admindID) => {
    try {
        const Admin = await admin.findById(admindID);

        const Accesstoken = Admin.generateAccessToken();
        const Refreshtoken = Admin.generateRefreshToken();

        Admin.Refreshtoken = Refreshtoken;
        await Admin.save({ validateBeforeSave: false });

        return { Accesstoken, Refreshtoken };
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token");
    }
};

const adminLogin = asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    // Rate limiting check
    const ipAddress = req.ip;
    const currentTime = Date.now();
    const userAttempts = loginAttempts.get(ipAddress) || { count: 0, timestamp: currentTime };

    if (userAttempts.count >= MAX_ATTEMPTS) {
        if (currentTime - userAttempts.timestamp < LOCKOUT_TIME) {
            throw new ApiError(429, "Too many login attempts. Please try again later.");
        }
        loginAttempts.delete(ipAddress); // Reset after lockout period
    }

    if ([username, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    const loggedAdmin = await admin.findOne({ username });
    if (!loggedAdmin) {
        updateLoginAttempts(ipAddress);
        throw new ApiError(400, "Admin does not exist");
    }

    const passwordCheck = await loggedAdmin.isPasswordCorrect(password);
    if (!passwordCheck) {
        updateLoginAttempts(ipAddress);
        throw new ApiError(400, "Password is incorrect");
    }

    const temp_admin = loggedAdmin._id;
    const { Accesstoken, Refreshtoken } = await generateAccessAndRefreshTokens(temp_admin);
    const loggedadmin = await admin.findById(temp_admin).select("-password -Refreshtoken");

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: 'strict'
    };

    return res
        .status(200)
        .cookie("Accesstoken", Accesstoken, options)
        .cookie("Refreshtoken", Refreshtoken, options)
        .json(new ApiResponse(200, { 
            admin: loggedadmin
        }, "logged in successfully"));
});

// Helper function to update login attempts
const updateLoginAttempts = (ipAddress) => {
    const currentAttempts = loginAttempts.get(ipAddress) || { count: 0, timestamp: Date.now() };
    loginAttempts.set(ipAddress, {
        count: currentAttempts.count + 1,
        timestamp: Date.now()
    });
};

// Clean up old entries periodically
setInterval(() => {
    const currentTime = Date.now();
    for (const [ip, data] of loginAttempts) {
        if (currentTime - data.timestamp >= LOCKOUT_TIME) {
            loginAttempts.delete(ip);
        }
    }
}, LOCKOUT_TIME);

const adminLogout = asyncHandler(async (req, res) => {
    await admin.findByIdAndUpdate(
        req.Admin._id,
        {
            $set: {
                Refreshtoken: undefined,
            }
        },
        {
            new: true
        }
    );
    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .clearCookie("Accesstoken", options)
        .clearCookie("Refreshtoken", options)
        .json(new ApiResponse(200, {}, "admin logged out"));
});

const forApproval = asyncHandler(async (req, res) => {
    const adminID = req.params.adminID;

    if (!adminID) {
        throw new ApiError(400, "not authorized");
    }

    const loggedAdmin = await admin.findById(adminID);

    if (!loggedAdmin) {
        throw new ApiError(400, "admin not found");
    }

    // Get all students and teachers who have submitted documents
    const students = await student.find({
        Studentdetails: { $ne: null }
    });

    const teachers = await Teacher.find({
        Teacherdetails: { $ne: null }
    });

    if (!students && !teachers) {
        return res
            .status(200)
            .json(new ApiResponse(200, loggedAdmin, "No student or teacher documents found"));
    }

    return res
        .status(200)
        .json(new ApiResponse(200, { admin: loggedAdmin, students, teachers }, "fetched successfully"));
});

const approveStudent = asyncHandler(async (req, res) => {
    const adminID = req.params.adminID;

    if (!adminID) {
        throw new ApiError(400, "not authorized");
    }

    const loggedAdmin = await admin.findById(adminID);

    if (!loggedAdmin) {
        throw new ApiError(400, "admin not found");
    }

    const studentID = req.params.studentID;

    if (!studentID) {
        throw new ApiError(400, "student id is required");
    }

    const toApprove = req.body.Isapproved;

    const email = req.body.email;

    const remarks = req.body.remarks || null;

    if (!toApprove || !["approved", "rejected", "reupload"].includes(toApprove)) {
        throw new ApiError(400, "Please choose 'approve' or 'reject' or 'reupload'");
    }

    // If status is being set to reupload, clear the existing documents
    const updateQuery = { 
        $set: { 
            Isapproved: toApprove, 
            Remarks: remarks 
        }
    };
    
    if (toApprove === 'reupload') {
        updateQuery.$set.Studentdetails = null; // Clear existing documents
    }

    const theStudent = await student.findOneAndUpdate(
        { _id: studentID }, 
        updateQuery, 
        { new: true }
    );

    if (!theStudent) {
        throw new ApiError(400, "faild to approve or reject || student not found");
    }

    // Create notification for student
    await createNotification(
        studentID,
        'students',
        'Document Verification Update',
        `Your documents have been ${toApprove}. ${remarks ? `Remarks: ${remarks}` : ''}`,
        toApprove === 'approved' ? 'success' : toApprove === 'rejected' ? 'error' : 'warning',
        `/dashboard/student/${studentID}/home`
    );

    console.log("email", email);

    const getStatusColor = (status) => {
        switch(status) {
            case 'approved': return '#4CAF50';
            case 'rejected': return '#f44336';
            case 'reupload': return '#ff9800';
            default: return '#4E84C1';
        }
    };

    const getStatusMessage = (status, remarks) => {
        switch(status) {
            case 'approved':
                return `Congratulations! Your documents have been verified and approved. You can now proceed with using the platform.`;
            case 'rejected':
                return `We regret to inform you that your documents could not be verified at this time.${remarks ? ' Please review the remarks below and consider resubmitting your documents.' : ''} You can apply again by submitting new documents.`;
            case 'reupload':
                return `Action Required: We need you to resubmit your documents for verification.${remarks ? ' Please review the remarks below regarding what needs to be fixed.' : ''}\n\nPlease log into your account and visit the document verification section to upload the requested documents. Your access to certain features will be limited until new documents are approved.`;
            default:
                return `We have completed the verification process for the documents you submitted.`;
        }
    };

    await Sendmail(email, `Document Verification Status Update - Action ${toApprove === 'reupload' ? 'Required' : 'Complete'}`,
        `<html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: ${getStatusColor(toApprove)}; margin: 0; padding: 20px 0;">Document Verification Update</h1>
                    <div style="background-color: ${getStatusColor(toApprove)}; color: white; padding: 10px; border-radius: 5px; margin: 20px 0;">
                        Status: ${toApprove === 'reupload' ? 'Action Required - Document Re-upload' : toApprove.charAt(0).toUpperCase() + toApprove.slice(1)}
                    </div>
                </div>
                <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
                    <p style="font-size: 16px; margin-bottom: 20px;">Dear ${firstName || 'User'},</p>
                    <p style="font-size: 16px; margin-bottom: 20px;">${getStatusMessage(toApprove, remarks)}</p>
                    ${remarks ? `<div style="background-color: #fff; padding: 15px; border-left: 4px solid ${getStatusColor(toApprove)}; margin-bottom: 20px;">
                        <strong>Remarks:</strong><br>
                        ${remarks}
                    </div>` : ''}
                    <p style="font-size: 16px;">If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
                </div>
                <div style="text-align: center; color: #666; border-top: 1px solid #eee; padding-top: 20px;">
                    <p style="margin: 5px 0;">Best regards,</p>
                    <p style="margin: 5px 0;"><strong>The Edify Team</strong></p>
                    <p style="font-size: 12px; color: #999; margin-top: 20px;">&copy; ${new Date().getFullYear()} Edify. All rights reserved.</p>
                </div>
            </body>
        </html>`
    );

    return res
        .status(200)
        .json(new ApiResponse(200, theStudent, `task done successfully`));
});

const approveTeacher = asyncHandler(async (req, res) => {
    const adminID = req.params.adminID;

    if (!adminID) {
        throw new ApiError(400, "not authorized");
    }

    const loggedAdmin = await admin.findById(adminID);

    if (!loggedAdmin) {
        throw new ApiError(400, "admin not found");
    }

    const teacherID = req.params.teacherID;

    if (!teacherID) {
        throw new ApiError(400, "student id is required");
    }

    const toApprove = req.body.Isapproved;
    const email = req.body.email;
    const remarks = req.body.remarks || null;

    if (!toApprove || (toApprove !== "approved" && toApprove !== "rejected" && toApprove !== "reupload")) {
        throw new ApiError(400, "Please choose 'approve' or 'reject' or 'reupload'");
    }

    const theTeacher = await Teacher.findOneAndUpdate({ _id: teacherID }, { $set: { Isapproved: toApprove, Remarks: remarks } }, { new: true });

    if (!theTeacher) {
        throw new ApiError(400, "faild to approve or reject || student not found");
    }

    // Create notification for teacher
    await createNotification(
        teacherID,
        'teachers',
        'Document Verification Update',
        `Your documents have been ${toApprove}. ${remarks ? `Remarks: ${remarks}` : ''}`,
        toApprove === 'approved' ? 'success' : toApprove === 'rejected' ? 'error' : 'warning',
        `/dashboard/teacher/${teacherID}/home`
    );

    await Sendmail(email, `Document Verification Status`,
        `<html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h1 style="color: #4CAF50; text-align: center;">Document Verification Status!</h1>
            <p style="font-size: 16px; text-align: center;">We have completed the verification process for the documents you submitted. Your document verification status is: ${toApprove}</p>
            <p style="font-size: 16px;">Remarks: ${remarks}</p>
            <p style="font-size: 16px;">Best regards,</p>
            <p style="font-size: 16px;"><strong>The Edify Team</strong></p>
            <p style="font-size: 14px;">&copy; 2024 Edify. All rights reserved.</p>
            </body>
        </html>`
    );

    return res
        .status(200)
        .json(new ApiResponse(200, theTeacher, `task done successfully`));
});

const checkStudentDocuments = asyncHandler(async (req, res) => {
    const adminID = req.params.adminID;

    if (!adminID) {
        throw new ApiError(400, "not authorized");
    }

    const loggedAdmin = await admin.findById(adminID);

    if (!loggedAdmin) {
        throw new ApiError(400, "admin not found");
    }

    const studentID = req.params.studentID;

    if (!studentID) {
        throw new ApiError(400, "no student ID");
    }

    const theStudent = await student.findById(studentID);

    if (!theStudent) {
        throw new ApiError(400, "student not found");
    }

    const docID = theStudent.Studentdetails;

    if (!docID) {
        throw new ApiError(400, "Documents not found, please update");
    }

    const studentDocs = await studentdocs.findById(docID);

    if (!studentDocs) {
        throw new ApiError(400, "failed to retrieve documents");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, { loggedAdmin, theStudent, studentDocs }, "documents retrieved successfully"));
});

const checkTeacherDocuments = asyncHandler(async (req, res) => {
    const adminID = req.params.adminID;

    if (!adminID) {
        throw new ApiError(400, "not authorized");
    }

    const loggedAdmin = await admin.findById(adminID);

    if (!loggedAdmin) {
        throw new ApiError(400, "admin not found");
    }

    const teacherID = req.params.teacherID;

    if (!teacherID) {
        throw new ApiError(400, "no Teacher ID");
    }

    const theTeacher = await Teacher.findById(teacherID);

    if (!theTeacher) {
        throw new ApiError(400, "Teacher not found");
    }

    const docID = theTeacher.Teacherdetails;

    if (!docID) {
        throw new ApiError(400, "Documents not found, please update");
    }

    const teacherDocs = await Teacherdocs.findById(docID);

    if (!teacherDocs) {
        throw new ApiError(400, "failed to retrieve documents");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, { loggedAdmin, theTeacher, teacherDocs }, "documents retrieved successfully"));
});

const sendmessage = asyncHandler(async (req, res) => {
    const { name, message, email } = req.body;

    if ([name, message, email].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    const contactUs = await contact.create({
        name,
        email,
        message
    });

    const createdContactUs = await contact.findById(contactUs._id);

    if (!contactUs) {
        throw new ApiError(400, "failed to send message");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, { contactUs: createdContactUs }, "message sent successfully"));
});

const allmessages = asyncHandler(async (req, res) => {
    const messages = await contact.find({
        status: false,
    }).sort({ _id: -1 });

    if (!messages) {
        return res
            .status(200)
            .json(new ApiResponse(200, {}, "no new messages"));
    }

    return res
        .status(200)
        .json(new ApiResponse(200, messages, "messages fetched"));
});

const readMessage = asyncHandler(async (req, res) => {
    const messageID = req.body.messageID;

    console.log(messageID);

    const isdone = await contact.findByIdAndUpdate({ _id: messageID }, { $set: { status: true } }, { new: true });

    if (!isdone) {
        throw new ApiError(400, "error occured while updating the status");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, isdone, "status updated successfully"));
});

const toapproveCourse = asyncHandler(async (req, res) => {
    const adminID = req.params.adminID;

    if (!adminID) {
        throw new ApiError(400, "not authorized");
    }

    const loggedAdmin = await admin.findById(adminID);

    if (!loggedAdmin) {
        throw new ApiError(400, "admin not found");
    }

    // Get both pending and approved courses
    const courses = await course.find({}).populate("enrolledteacher");
    
    if (!courses) {
        throw new ApiError(404, "No courses found");
    }

    return res.status(200).json(new ApiResponse(200, courses, "Courses fetched successfully"));
});

const approveCourse = asyncHandler(async (req, res) => {
    const adminID = req.params.adminID;

    if (!adminID) {
        throw new ApiError(400, "not authorized");
    }

    const loggedAdmin = await admin.findById(adminID);

    if (!loggedAdmin) {
        throw new ApiError(400, "admin not found");
    }

    const courseID = req.params.courseID;

    if (!courseID) {
        throw new ApiError(400, "course id is required");
    }

    const toApprove = req.body.Isapproved;

    if (toApprove) {
        const theCourse = await course.findOneAndUpdate({ _id: courseID }, { $set: { isapproved: toApprove } }, { new: true });

        if (!theCourse) {
            throw new ApiError(400, "faild to approve or reject");
        }

        const Fname = req.body.Firstname;

        // Create notification for teacher
        await createNotification(
            theCourse.enrolledteacher,
            'teachers',
            'Course Approval Update',
            `Your course "${theCourse.coursename}" has been approved.`,
            'success',
            `/dashboard/teacher/${theCourse.enrolledteacher}/courses`
        );

        Sendmail(req.body.email, `Course Approval Update`,
            `<html>
                <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h1 style="color: #4CAF50; text-align: center;">Congratulations!</h1>
                <p style="font-size: 16px; text-align: center;">Dear ${Fname},</p>
                <p style="font-size: 16px; text-align: center;">We are delighted to inform you that your course ( ${theCourse.coursename} ) submission has been reviewed and approved by our team.</p>
                <p style="font-size: 16px;">Thank you for being a part of our educational community. We look forward to seeing your course make a positive impact on learners around the world.</p>
                <p style="font-size: 16px;">Best regards,</p>
                <p style="font-size: 16px;"><strong>The Edify Team</strong></p>
                <p style="font-size: 14px;">&copy; 2024 Edify. All rights reserved.</p>
                </body>
            </html>
        `);

        return res
            .status(200)
            .json(new ApiResponse(200, theCourse, `Course approved successfully`));
    } else {
        const theCourse = await course.findById(courseID);
        if (!theCourse) {
            throw new ApiError(400, "Course not found");
        }

        // Create notification for teacher before deleting course
        await createNotification(
            theCourse.enrolledteacher,
            'teachers',
            'Course Approval Update',
            `Your course "${theCourse.coursename}" was not approved and has been removed.`,
            'error',
            `/dashboard/teacher/${theCourse.enrolledteacher}/courses`
        );

        await course.findByIdAndDelete(courseID);
        const Fname = req.body.Firstname;

        Sendmail(req.body.email, `Course Approval Update`,
            `<html>
                <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h1 style="color: #4CAF50; text-align: center;">Course Submission Update!</h1>
                <p style="font-size: 16px; text-align: center;">Dear ${Fname},</p>
                <p style="font-size: 16px; text-align: center;">After a thorough evaluation, we regret to inform you that your course, <strong>( ${theCourse.coursename} )</strong>, does not meet the requirements for approval at this time.</p>
                <p style="font-size: 16px;">Thank you for your understanding and continued commitment to providing quality education.</p>
                <p style="font-size: 16px;">Best regards,</p>
                <p style="font-size: 16px;"><strong>The Edify Team</strong></p>
                <p style="font-size: 14px;">&copy; 2024 Edify. All rights reserved.</p>
                </body>
            </html>
        `);

        return res
            .status(200)
            .json(new ApiResponse(200, {}, `Course rejected successfully`));
    }
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies?.Refreshtoken || req.body?.Refreshtoken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request");
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
        const Admin = await admin.findById(decodedToken?._id);

        if (!Admin) {
            throw new ApiError(401, "Invalid refresh token");
        }

        if (incomingRefreshToken !== Admin?.Refreshtoken) {
            throw new ApiError(401, "Refresh token is expired or used");
        }

        const { Accesstoken, Refreshtoken } = await generateAccessAndRefreshTokens(Admin._id);

        const options = {
            httpOnly: true,
            secure: true
        };

        return res
            .status(200)
            .cookie("Accesstoken", Accesstoken, options)
            .cookie("Refreshtoken", Refreshtoken, options)
            .json(new ApiResponse(200, { Accesstoken }, "Access token refreshed"));
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token");
    }
});

export {
    adminSignUp,
    adminLogin,
    forApproval,
    approveStudent,
    approveTeacher,
    checkStudentDocuments,
    checkTeacherDocuments,
    adminLogout,
    sendmessage,
    allmessages,
    readMessage,
    toapproveCourse,
    approveCourse,
    refreshAccessToken
};
