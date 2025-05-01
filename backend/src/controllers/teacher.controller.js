import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Teacher, Teacherdocs } from "../models/teacher.model.js"; 
import { ApiResponse } from "../utils/ApiResponse.js";
import { Sendmail } from "../utils/Nodemailer.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { student } from "../models/student.model.js";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const sendVerificationEmail = async (email, teacherId) => {
    try {
        const emailSender = nodemailer.createTransport({
            host: process.env.SMTP_EMAIL_HOST,
            port: process.env.SMTP_EMAIL_HOST_PORT,
            secure: true,
            auth: {
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_PASS,
            }
        });
        const mailOptions = {
            from: "edify-noreply@lsanalab.xyz",
            to: email,
            subject: "Verify your E-mail",
            html: `<div style="text-align: center;">
            <p style="margin: 20px;"> Hi, Please click the button below to verify your E-mail. </p>
            <img src="https://img.freepik.com/free-vector/illustration-e-mail-protection-concept-e-mail-envelope-with-file-document-attach-file-system-security-approved_1150-41788.jpg?size=626&ext=jpg&uid=R140292450&ga=GA1.1.553867909.1706200225&semt=ais" alt="Verification Image" style="width: 100%; height: auto;">
            <br>
            <a href="${process.env.FRONTEND_URL}/api/teacher/verify?id=${teacherId}">
                <button style="background-color: black; color: white; padding: 10px 20px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 10px 0; cursor: pointer;">Verify Email</button>
            </a>
        </div>`
        };
        await emailSender.sendMail(mailOptions);
    } catch (error) {
        throw new ApiError(400, "Failed to send email verification");
    }
};

const generateAccessAndRefreshTokens = async (teacherId) => { 
    try {
        const teacher = await Teacher.findById(teacherId);
        const Accesstoken = teacher.generateAccessToken();
        const Refreshtoken = teacher.generateRefreshToken();

        teacher.Refreshtoken = Refreshtoken;
        await teacher.save({ validateBeforeSave: false });

        return { Accesstoken, Refreshtoken };
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access token");
    }
};

const registerTeacher = asyncHandler(async (req, res) => {
    const { Firstname, Lastname, Email, Password } = req.body;

    if ([Firstname, Lastname, Email, Password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    const existedTeacher = await Teacher.findOne({ Email });

    if (existedTeacher) {
        throw new ApiError(400, "Teacher already exists");
    }
    const existedStudent = await student.findOne({ Email: req.body.Email });
    if(existedStudent){
        throw new ApiError(400, "Email Belong to Student")
    }

    const newTeacher = await Teacher.create({
        Email,
        Firstname,
        Lastname,
        Password,
        Teacherdetails: null,
    });

    const verificationToken = crypto.randomBytes(32).toString('hex');
    newTeacher.verificationToken = verificationToken;
    
    await sendVerificationEmail(Email, newTeacher._id);
    await newTeacher.save();

    const createdTeacher = await Teacher.findById(newTeacher._id).select("-Password");

    if (!createdTeacher) {
        throw new ApiError(501, "Teacher registration failed");
    }

    return res.status(200).json(
        new ApiResponse(200, createdTeacher, "Signup successful")
    );
});

const verifyEmail = asyncHandler(async (req, res) => {
    const teacherId = req.query.id;
    
    if (!teacherId) {
        throw new ApiError(400, "Teacher ID is required");
    }

    const teacher = await Teacher.findById(teacherId);
    
    if (!teacher) {
        throw new ApiError(400, "Invalid teacher ID");
    }
    
    teacher.Isverified = true;
    teacher.verificationToken = undefined;
    await teacher.save();
    
    return res.send(`
    <div style="text-align: center; height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; font-family: Arial, sans-serif;">
        <img src="https://cdn-icons-png.flaticon.com/128/4436/4436481.png" alt="Verify Email Icon" style="width: 100px; height: 100px;">
        <h1 style="font-size: 36px; font-weight: bold; padding: 20px;">Email Verified Successfully!</h1>
        <h4 style="margin-bottom: 20px;">Your email address was successfully verified.</h4>
        <p style="margin-bottom: 20px; color: #666;">Please complete your profile by uploading the required documents.</p>
        <button onclick="window.location.href='${process.env.FRONTEND_URL}/TeacherDocument/${teacher._id}'" 
                style="background-color: #4E84C1; color: white; padding: 12px 24px; border: none; border-radius: 6px; 
                       font-size: 16px; cursor: pointer; transition: background-color 0.3s;">
            Continue to Document Upload
        </button>
    </div>`);
});

const login = asyncHandler(async (req, res) => {
    const { Email, Password } = req.body;

    if (!Email || !Password) {
        throw new ApiError(400, "Email and password are required");
    }

    const teacher = await Teacher.findOne({ Email }).select("+Password");

    if (!teacher) {
        throw new ApiError(403, "Teacher does not exist");
    }

    const isPasswordCorrect = await teacher.isPasswordCorrect(Password);

    if (!isPasswordCorrect) {
        throw new ApiError(401, "Password is incorrect");
    }

    const { Accesstoken, Refreshtoken } = await generateAccessAndRefreshTokens(teacher._id);
    const loggedInTeacher = await Teacher.findById(teacher._id)
        .select("-Password -Refreshtoken");

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: 'strict'
    };

    // Temporarily skip document verification checks

    return res
        .status(200)
        .cookie("Accesstoken", Accesstoken, options)
        .cookie("Refreshtoken", Refreshtoken, options)
        .json(new ApiResponse(200, {
            user: loggedInTeacher
        }, "Logged in successfully"));
});

const logout = asyncHandler(async(req, res)=>{
    await Teacher.findByIdAndUpdate(req.teacher?._id,
        {
            $set:{
                Refreshtoken:undefined,
            }
        },
        {
            new:true
        }
    )

    const options ={
        httpOnly:true,
        secure:true,
    }

    return res
    .status(200)
    .clearCookie("Accesstoken", options)
    .clearCookie("Refreshtoken",  options)
    .json(new ApiResponse(200, {}, "User logged out"))
})

const getTeacher = asyncHandler(async(req,res) =>{
    const user = req.teacher

    const id = req.params.id
    if(req.teacher._id != id){
        throw new ApiError(400, "unauthroized access")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, user, "Teacher is logged in"))
})

const addTeacherDetails = asyncHandler(async(req, res) => {
    const id = req.params.id;
    if(req.teacher._id != id){
        throw new ApiError(400, "unauthorized access");
    }

    const {
        Phone, Address, Experience, SecondarySchool, 
        HigherSchool, UGcollege, PGcollege, 
        SecondaryMarks, HigherMarks, UGmarks, PGmarks,
        Aadhaar, Secondary, Higher, UG, PG // These are now URLs
    } = req.body;

    // Validation
    if(!Aadhaar || !Secondary || !Higher || !UG || !PG) {
        throw new ApiError(400, "All documents are required");
    }

    const teacherdetails = await Teacherdocs.create({
        Phone,
        Address,
        Experience,
        SecondarySchool,
        HigherSchool,
        UGcollege,
        PGcollege,
        SecondaryMarks,
        HigherMarks,
        UGmarks,
        PGmarks,
        Aadhaar,
        Secondary,
        Higher,
        UG,
        PG
    });

    const theTeacher = await Teacher.findOneAndUpdate({_id: id}, {$set: {Isapproved:"pending", Teacherdetails: teacherdetails._id}},  { new: true }).select("-Password -Refreshtoken")
    
    if(!theTeacher){
        throw new ApiError(400,"faild to approve or reject || student not found")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, {teacher:theTeacher}, "documents uploaded successfully"))

})

const teacherdocuments = asyncHandler(async(req, res)=>{
    const teacherID = req.body.teacherID;

    const teacherDocs = await Teacherdocs.findById(teacherID);

    if(!teacherDocs){
        throw new ApiError(400, 'no teacher found');
    }

    return res 
    .status(200)
    .json(new ApiResponse(200, teacherDocs, "teacher documents fetched"))
})

const ForgetPassword=asyncHandler(async(req,res)=>{

    const { Email } =  req.body
 
    if(!Email){
     throw new ApiError(400, "Email is required")
     }
    
     const User=await Teacher.findOne({Email});
 
     if(!User){
        throw new ApiError(404,"email not found!!");
     }
 
    await User.generateResetToken();
 
    await User.save();
 
    const resetToken=`${process.env.FRONTEND_URL}/teacher/forgetpassword/${User.forgetPasswordToken}`
   
    const subject='RESET PASSWORD'
 
    const message=` <p>Dear ${User.Firstname}${User.Lastname},</p>
    <p>We have received a request to reset your password. To proceed, please click on the following link: <a href="${resetToken}" target="_blank">reset your password</a>.</p>
    <p>If the link does not work for any reason, you can copy and paste the following URL into your browser's address bar:</p>
    <p>${resetToken}</p>
    <p>Thank you for being a valued member of the Edify community. If you have any questions or need further assistance, please do not hesitate to contact our support team.</p>
    <p>Best regards,</p>
    <p>The Edify Team</p>`
 
    try{
     
     await Sendmail(Email,subject,message);
 
     res.status(200).json({
 
         success:true,
         message:`Reset password Email has been sent to ${Email} the email SuccessFully`
      })
 
     }catch(error){
 
         throw new ApiError(404,"operation failed!!");
     }
 
 
 })
 
 
 
 const  ResetPassword= asyncHandler(async (req, res) => {
     const { token } = req.params;
     const { password,confirmPassword} = req.body;

     if(password != confirmPassword){
         throw new ApiError(400,"password does not match")
     }
         
     console.log("flag",token,password);
 
     try {
         const user = await Teacher.findOne({
             forgetPasswordToken:token,
             forgetPasswordExpiry: { $gt: Date.now() }
         });
          console.log("flag2",user);
 
         if (!user) {
             throw new ApiError(400, 'Token is invalid or expired. Please try again.');
         }
 
    
 
         user.Password = password; 
         user.forgetPasswordExpiry = undefined;
         user.forgetPasswordToken = undefined;
 
         await user.save(); 
 
         res.status(200).json({
             success: true,
             message: 'Password changed successfully!'
         });
     } catch (error) {
         console.error('Error resetting password:', error);
         throw new ApiError(500, 'Internal server error!!!');
     }
 });

const refreshAccessToken = asyncHandler(async (req, res) => {
    try {
        const incomingRefreshToken = req.cookies?.Refreshtoken || req.body?.Refreshtoken;

        if (!incomingRefreshToken) {
            throw new ApiError(401, "Unauthorized request - No refresh token");
        }

        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
        
        const teacher = await Teacher.findById(decodedToken._id);
        if (!teacher) {
            throw new ApiError(401, "Invalid refresh token - Teacher not found");
        }

        if (incomingRefreshToken !== teacher.Refreshtoken) {
            throw new ApiError(401, "Refresh token is expired or used");
        }

        const {Accesstoken, Refreshtoken} = await generateAccessAndRefreshTokens(teacher._id);

        const options = {
            httpOnly: true,
            secure: true,
            sameSite: 'Strict'
        }

        return res
            .status(200)
            .cookie("Accesstoken", Accesstoken, options)
            .cookie("Refreshtoken", Refreshtoken, options)
            .json(new ApiResponse(200, { 
                success: true,
                message: "Access token refreshed"
            }));
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            throw new ApiError(401, "Invalid refresh token");
        }
        if (error.name === 'TokenExpiredError') {
            throw new ApiError(401, "Refresh token has expired");
        }
        throw new ApiError(401, error?.message || "Invalid refresh token");
    }
});

export {
    registerTeacher,
    verifyEmail,
    login,
    logout,
    getTeacher,
    teacherdocuments,
    ForgetPassword,
    ResetPassword,
    refreshAccessToken,
    addTeacherDetails
};
