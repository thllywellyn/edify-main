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

        const Teacher = await Teacher.findById(decodedToken._id)
            .select("-Password -Refreshtoken");

        if (!Teacher) {
            throw new ApiError(401, "Teacher account not found");
        }

        // Define allowed routes for non-approved users
        const isVerificationRoute = req.path.includes('/verification/');
        const isDocumentRoute = req.path.includes('/TeacherDocument/') || 
            req.path.includes('/dashboard/teacher/documents') || 
            req.path.includes('/api/teacher/document/') ||
            req.path.includes('/api/teacher/verification/');
        const isAllowedRoute = isVerificationRoute || isDocumentRoute;

        // Set teacher info in request
        req.teacher = Teacher;

        // Allow document routes for all states
        if (isAllowedRoute) {
            return next();
        }

        // Handle document states
        if (!Teacher.Isapproved || ['pending', 'rejected', 'reupload'].includes(Teacher.Isapproved)) {
            throw new ApiError(403, `Please complete your document verification. Current status: ${Teacher.Isapproved || 'not submitted'}`);
        }

        next();
    } catch (error) {
        next(error);
    }
});

export {authTeacher};