import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import Razorpay from "razorpay"

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    exposedHeaders: ['Set-Cookie', 'Authorization'],
    preflightContinue: false,
    optionsSuccessStatus: 200
}))

app.use(cookieParser())

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))

// Initialize Razorpay with proper error handling and reconnection logic
let instance;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 3;
const RECONNECT_DELAY = 5000; // 5 seconds

const initializeRazorpay = async () => {
    try {
        // Validate Razorpay credentials
        const KEY_ID = process.env.KEY_ID?.trim();
        const KEY_SECRET = process.env.KEY_SECRET?.trim();

        if (!KEY_ID || !KEY_SECRET) {
            throw new Error('Razorpay credentials are missing');
        }

        if (!KEY_ID.startsWith('rzp_test_') && !KEY_ID.startsWith('rzp_live_')) {
            throw new Error('Invalid Razorpay key format');
        }

        instance = new Razorpay({
            key_id: KEY_ID,
            key_secret: KEY_SECRET,
            headers: {
                "Content-Type": "application/json"
            }
        });

        // Verify Razorpay connection with timeout
        await Promise.race([
            instance.orders.all({ count: 1 }),
            new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Connection timeout')), 5000)
            )
        ]);

        console.log('✅ Razorpay connection verified');
        reconnectAttempts = 0; // Reset attempts on successful connection
        return true;
    } catch (error) {
        console.error('❌ Razorpay connection failed:', error);
        
        if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
            reconnectAttempts++;
            console.log(`Attempting to reconnect (${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS}) in ${RECONNECT_DELAY/1000} seconds...`);
            
            await new Promise(resolve => setTimeout(resolve, RECONNECT_DELAY));
            return initializeRazorpay();
        }
        
        console.error('Maximum reconnection attempts reached. Exiting...');
        process.exit(1);
    }
};

// Initial connection
initializeRazorpay();

export { instance };

//student routes
import studentRouter from "./routes/student.routes.js";
app.use("/api/student", studentRouter)

//teacher routes
import teacherRouter from "./routes/teacher.routes.js"
app.use("/api/teacher", teacherRouter)

//course routes
import courseRouter from "./routes/course.routes.js"
app.use("/api/course", courseRouter)

import adminRouter from "./routes/admin.routes.js"
app.use("/api/admin", adminRouter)

import paymentRouter from "./routes/payment.routes.js"
app.use("/api/payment", paymentRouter)

import uploadRouter from './routes/upload.routes.js';
app.use('/api/upload', uploadRouter);

import notificationRouter from './routes/notification.routes.js';
app.use("/api/notifications", notificationRouter);

export { app }