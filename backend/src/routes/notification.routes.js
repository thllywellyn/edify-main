import { Router } from "express";
import { getNotifications, markNotificationRead, markAllNotificationsRead } from "../controllers/notification.controller.js";
import { authTeacher } from "../middlewares/teacherAuth.middleware.js";
import { authSTD } from "../middlewares/stdAuth.middleware.js";
import { authAdmin } from "../middlewares/adminAuth.middleware.js";

const router = Router();

// Combined auth middleware
const combinedAuth = (req, res, next) => {
    if (req.Student || req.teacher || req.Admin) {
        req.user = req.Student || req.teacher || req.Admin;
        next();
    } else {
        res.status(401).json({ error: "Unauthorized" });
    }
};

// Apply auth middleware to all routes
router.use([authSTD, authTeacher, authAdmin], combinedAuth);

router.get("/", getNotifications);
router.patch("/:notificationId/read", markNotificationRead);
router.patch("/mark-all-read", markAllNotificationsRead);

export default router;