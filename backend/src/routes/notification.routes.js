import { Router } from "express";
import { getNotifications, markNotificationRead, markAllNotificationsRead } from "../controllers/notification.controller.js";
import { authTeacher } from "../middlewares/teacherAuth.middleware.js";
import { authSTD } from "../middlewares/stdAuth.middleware.js";
import { authAdmin } from "../middlewares/adminAuth.middleware.js";

const router = Router();

// Route can be accessed by any authenticated user (student, teacher, or admin)
router.use((req, res, next) => {
    if (req.Student || req.teacher || req.Admin) {
        req.user = req.Student || req.teacher || req.Admin;
        next();
    } else {
        res.status(401).json({ error: "Unauthorized" });
    }
});

router.get("/", [authSTD || authTeacher || authAdmin], getNotifications);
router.patch("/:notificationId/read", [authSTD || authTeacher || authAdmin], markNotificationRead);
router.patch("/mark-all-read", [authSTD || authTeacher || authAdmin], markAllNotificationsRead);

export default router;