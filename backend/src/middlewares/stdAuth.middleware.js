import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { student } from "../models/student.model.js";
import jwt from "jsonwebtoken";

const authSTD = asyncHandler(async (req, _, next) => {
    try {
        const accToken = req.cookies?.accessToken || req.cookies?.Accesstoken || req.headers?.authorization?.replace('Bearer ', '');
        
        if (!accToken) {
            throw new ApiError(401, "Unauthorized: Please log in to access this resource");
        }

        let decodedToken;
        try {
            decodedToken = jwt.verify(accToken, process.env.ACCESS_TOKEN_SECRET);
            if (!decodedToken._id || decodedToken.type !== 'student') {
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

        const Student = await student.findById(decodedToken._id)
            .select("-Password -Refreshtoken");

        if (!Student) {
            throw new ApiError(401, "Student account not found");
        }

        // Add additional checks for student status
        if (!Student.Isverified) {
            throw new ApiError(401, "Email not verified");
        }

        // Define allowed routes for non-approved users
        const isVerificationRoute = req.path.includes('/Verification/');
        const isDocumentRoute = req.path.includes('/StudentDocument/') || 
            req.path.includes('/dashboard/student/documents') || 
            req.path.includes('/api/student/document/') ||
            req.path.includes('/api/student/verification/');
        const isAllowedRoute = isVerificationRoute || isDocumentRoute;

        // Set student info in request
        req.Student = Student;

        // Allow document routes for all states
        if (isAllowedRoute) {
            return next();
        }

        // Handle document states
        if (!Student.Isapproved || ['pending', 'rejected', 'reupload'].includes(Student.Isapproved)) {
            throw new ApiError(403, `Please complete your document verification. Current status: ${Student.Isapproved || 'not submitted'}`);
        }

        next();
    } catch (error) {
        next(error);
    }
})

export { authSTD }