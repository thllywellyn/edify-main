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
        isPublished: {
            type: Boolean,
            default: false
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
        date: { type: Date }
    }],
    enrolledStudent: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'students'
    }],
    enrolledteacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'teachers',
        required: true
    },
    isapproved: {
        type: Boolean,
        default: false
    },
    price: {
        type: Number,
        required: true,
        min: 1,
        set: value => Number(value)
    }
}, {
    timestamps: true
})

// Add indexes to improve query performance
courseSchema.index({ coursename: 1 });
courseSchema.index({ enrolledStudent: 1 });
courseSchema.index({ enrolledteacher: 1 });

export const course = mongoose.model("courses", courseSchema);