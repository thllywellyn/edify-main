import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
    coursename: {
        type: String,
        required: true,
        lowercase: true
    },
    description: {
        type: String,
        required: true,
    },
    videos: [{
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        },
        duration: {
            type: Number,
            default: 0
        },
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    }],
    schedule: [{
        day: { type: Number },
        starttime: { type: Number },
        endtime: { type: Number }
    }],
    liveClasses: [{
        title: { type: String },
        timing: { type: Number },
        link: { type: String },
        status: { type: String },
        date: { type: Date },
    }],
    enrolledStudent: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'students'
    }],
    enrolledteacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'teachers'
    },
    isapproved: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

export const course = mongoose.model("courses", courseSchema);