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
            req.path.includes('/api/student/document/');
        const isAllowedRoute = isVerificationRoute || isDocumentRoute;

        // Handle document states with improved messaging
        if (!Student.Isapproved || Student.Isapproved === 'reupload') {
            if (!isAllowedRoute) {
                if (Student.Isapproved === 'reupload') {
                    throw new ApiError(403, "Please re-upload your documents to continue. You can access the document upload section.");
                } else if (Student.Isapproved === 'pending') {
                    throw new ApiError(403, "Your documents are under review. Document upload section is accessible.");
                } else if (Student.Isapproved === 'rejected') {
                    throw new ApiError(403, "Your documents were rejected. Please check remarks and resubmit in the document section.");
                } else {
                    throw new ApiError(403, "Please complete your document verification. Access granted to document section.");
                }
            }
        }

        // Add user info to request
        req.user = Student;
        next();
    } catch (error) {
        next(error);
    }
})

export { authSTD }