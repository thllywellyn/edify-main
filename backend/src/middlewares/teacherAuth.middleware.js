import { ApiError } from "../utils/ApiError.js";
import {Teacher} from "../models/teacher.model.js";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";

const authTeacher = asyncHandler(async(req, _, next) => {
    try {
        const accToken = req.cookies?.Accesstoken || req.cookies?.accessToken || req.headers?.authorization?.replace('Bearer ', '');
        
        if (!accToken) {
            throw new ApiError(401, "Unauthorized: Please log in to access this resource");
        }

        let decodedToken;
        try {
            decodedToken = jwt.verify(accToken, process.env.ACCESS_TOKEN_SECRET);
            if (!decodedToken._id || decodedToken.type !== 'teacher') {
                throw new ApiError(401, "Invalid access token");
            }
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                throw new ApiError(401, "Access token has expired");
            }
            if (error.name === 'JsonWebTokenError') {
                throw new ApiError(401, "Invalid token");
            }
            throw error;
        }

        const teacher = await Teacher.findById(decodedToken._id)
            .select("-Password -Refreshtoken");

        if (!teacher) {
            throw new ApiError(401, "Teacher account not found");
        }

        req.teacher = teacher;
        next();
    } catch (error) {
        next(error);
    }
});

export {authTeacher};