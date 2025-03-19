import { Router } from 'express';
import { upload } from '../middlewares/multer.middleware.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/apiError.js';
import fs from 'fs';

const router = Router();

router.post('/', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            throw new ApiError(400, 'No file uploaded');
        }

        const cloudinaryResponse = await uploadOnCloudinary(req.file.path);
        
        // Clean up the temporary file
        if (req.file.path && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        if (!cloudinaryResponse) {
            throw new ApiError(500, 'Failed to upload to cloudinary');
        }

        return res.json(
            new ApiResponse(200, { url: cloudinaryResponse.url }, "File uploaded successfully")
        );
    } catch (error) {
        // Clean up on error
        if (req.file && req.file.path && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        
        return res.status(error.statusCode || 500).json(
            new ApiResponse(error.statusCode || 500, null, error.message || 'Something went wrong while uploading')
        );
    }
});

export default router;
