import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

const courseAuth = asyncHandler(async (req, _, next) => {
    // Check if either middleware has authenticated the user
    if (!req.Student && !req.teacher) {
        throw new ApiError(401, "Authentication required");
    }
    next();
});

export { courseAuth };