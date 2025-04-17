import mongoose from "mongoose";
// Import all models to ensure they are registered before database connection
import "../models/teacher.model.js";
import "../models/student.model.js";
import "../models/course.model.js";
import "../models/admin.model.js";
import "../models/contact.model.js";
import "../models/payment.model.js";

const db = async() => {
    try{
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}`)
        console.log(`\n MongoDB connected !! DB HOST :: ${connectionInstance.connection.host}`)
    } catch (error){
        console.log("Mongodb connection error", error);
        process.exit(1)
    }
}

export default db