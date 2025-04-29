import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import { admin } from "../models/admin.model.js";
import jwt from "jsonwebtoken";

const authAdmin = asyncHandler(async(req, _, next) => {
    try {
        const accToken = req.cookies?.Accesstoken;
        if (!accToken) {
            throw new ApiError(401, "Unauthorized: Please log in to access this resource");
        }

        let decodedToken;
        try {
            decodedToken = jwt.verify(accToken, process.env.ACCESS_TOKEN_SECRET);
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                throw new ApiError(401, "Access token has expired");
            }
            if (error.name === 'JsonWebTokenError') {
                throw new ApiError(401, "Invalid token");
            }
            throw error;
        }

        if (!decodedToken?._id) {
            throw new ApiError(401, "Invalid access token format");
        }

        const Admin = await admin.findById(decodedToken._id)
            .select("-password -Refreshtoken");

        if (!Admin) {
            throw new ApiError(401, "Admin account not found");
        }

        req.Admin = Admin;
        next();
    } catch (error) {
        next(error);
    }
})

export { authAdmin }