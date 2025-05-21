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
        const isDocumentUploadRoute = req.path.includes('/StudentDocument/') || req.path.includes('/dashboard/student/') && req.path.includes('/documents');
        const isAllowedRoute = isVerificationRoute || isDocumentUploadRoute;

        // Handle re-upload and other non-approved states
        if (Student.Isapproved === 'reupload' && !isAllowedRoute) {
            throw new ApiError(401, "Your documents need to be re-uploaded. Please visit your dashboard to complete this process.");
        }
        
        // For other non-approved statuses
        if (Student.Isapproved !== 'approved' && !isAllowedRoute) {
            if (Student.Isapproved === 'pending') {
                throw new ApiError(401, "Your documents are under review. Please wait for approval.");
            } else if (Student.Isapproved === 'rejected') {
                throw new ApiError(401, "Your documents were rejected. Please check the remarks and resubmit.");
            } else {
                throw new ApiError(401, "Account not approved. Please complete document verification.");
            }
        }

        req.Student = Student;
        next();
    } catch (error) {
        next(error);
    }
})

export { authSTD }