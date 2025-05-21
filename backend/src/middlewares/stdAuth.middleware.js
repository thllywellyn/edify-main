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

        // Check if this is a verification-related route
        const isVerificationRoute = req.path.includes('/Verification/');
        const isDocumentUploadRoute = req.path.includes('/StudentDocument/');

        // If status is reupload, only allow access to document upload routes
        if (Student.Isapproved === 'reupload' && !isDocumentUploadRoute) {
            throw new ApiError(401, "Please reupload your documents. Visit the document verification page to continue.");
        }
        
        // For other non-approved statuses, only allow access to verification and document upload routes
        if (!isVerificationRoute && !isDocumentUploadRoute && Student.Isapproved !== 'approved') {
            throw new ApiError(401, "Account not approved");
        }

        req.Student = Student;
        next();
    } catch (error) {
        next(error);
    }
})

export { authSTD }