const asyncHandler = (fn) => async (req, res, next) => {
    try {
        await fn(req, res, next);
    } catch (error) {
        if (error.isJoi === true) {
            error.statusCode = 422;
        }
        
        // Standardize authentication errors
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            error.statusCode = 401;
        }
        
        // Handle unauthorized access - safely check message
        if (error.message && typeof error.message === 'string' && 
            error.message.toLowerCase().includes('unauthorized')) {
            error.statusCode = 401;
        }

        res.status(error.statusCode || 500).json({
            statusCode: error.statusCode || 500,
            message: error.message || 'Internal Server Error',
            success: false
        });
    }
};

export { asyncHandler };
