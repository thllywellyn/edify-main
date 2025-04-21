import { ApiError } from "../utils/ApiError.js";
import {Teacher} from "../models/teacher.model.js";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";

const authTeacher = asyncHandler(async(req, _, next) => {
    try {
        const accToken = req.cookies?.Accesstoken;

        if (!accToken) {
            throw new ApiError(401, "Unauthorized request");
        }

        const decodedToken = jwt.verify(accToken, process.env.ACCESS_TOKEN_SECRET);
        
        if (!decodedToken?._id) {
            throw new ApiError(401, "Invalid access token format");
        }

        const teacher = await Teacher.findById(decodedToken._id)
            .select("-Password -Refreshtoken");

        if (!teacher) {
            throw new ApiError(401, "Teacher not found");
        }

        // Add teacher to request object
        req.teacher = teacher;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            throw new ApiError(401, "Invalid token");
        }
        if (error.name === 'TokenExpiredError') {
            throw new ApiError(401, "Token has expired");
        }
        throw error;
    }
})

export {authTeacher};