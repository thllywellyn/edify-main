import mongoose from "mongoose";
// Import and register all models before database connection
import { student } from "../models/student.model.js";
import { Teacher, Teacherdocs } from "../models/teacher.model.js";
import { course } from "../models/course.model.js";
import { admin } from "../models/admin.model.js";
import { contact } from "../models/contact.model.js";
import { payment } from "../models/payment.model.js";
import { Notification } from "../models/notification.model.js";

const db = async() => {
    try{
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}`);
        console.log(`\n MongoDB connected !! DB HOST :: ${connectionInstance.connection.host}`);
    } catch (error){
        console.log("Mongodb connection error", error);
        process.exit(1);
    }
};

export default db;