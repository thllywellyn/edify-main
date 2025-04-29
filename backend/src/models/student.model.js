import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import crypto from "crypto"

const studentSchema = new Schema({
    Firstname: {
        type: String,
        required: true,
    },
    Lastname: {
        type: String,
        required: true,
    },
    Email: {
        type: String,
        required: true,
        unique: true,
    },
    Password: {
        type: String,
        required: true,
    },
    Studentdetails: {
        type: Schema.Types.ObjectId,
        ref: "studentdocs",
        default: null
    },
    Avatar: {
        type: String,
        default: ""
    },
    Course: {
        type: Schema.Types.ObjectId,
        ref: "course",
        default: null
    },
    Payment: {
        type: Schema.Types.ObjectId,
        ref: "payment",
        default: null
    },
    Isverified: {
        type: Boolean,
        default: false
    },
    Isapproved: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    Refreshtoken: {
        type: String
    },
    forgetPasswordToken: String,
    forgetPasswordExpiry: Date,

}, { timestamps: true })

studentSchema.pre("save", async function (next) {
    if (!this.isModified("Password")) return next();

    this.Password = await bcrypt.hash(this.Password, 10)
    next()
})

studentSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.Password)
}

studentSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            Email: this.Email,
            Firstname: this.Firstname,
            Lastname: this.Lastname,
            type: "student"
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

studentSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

studentSchema.methods.generateResetToken = async function () {
    const resetToken = crypto.randomBytes(20).toString('hex');

    this.forgetPasswordToken = resetToken;
    this.forgetPasswordExpiry = Date.now() + 15 * 60 * 1000; // 15 minutes

    return resetToken;
};

export const student = mongoose.model("students", studentSchema)

const studentdocsSchema = new Schema({
    Phone: {
        type: String,
        required: true,
        unique: true
    },
    Address: {
        type: String,
        required: true,
    },
    Highesteducation: {
        type: String,
        required: true
    },
    SecondarySchool: {
        type: String,
        required: true,
    },
    SecondaryMarks: {
        type: String,
        required: true,
    },
    HigherSchool: {
        type: String,
        required: true,
    },
    HigherMarks: {
        type: String,
        required: true,
    },
    Aadhaar: {
        type: String,
        required: true,
    },
    Secondary: {
        type: String,
        required: true,
    },
    Higher: {
        type: String,
        required: true,
    }
})

export const studentdocs = mongoose.model("studentdocs", studentdocsSchema)