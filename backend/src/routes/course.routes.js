import { Router } from "express";
import { addClass, addCourseStudent, addCourseTeacher, addCourseVideo, canStudentEnroll, enrolledcourseSTD, enrolledcourseTeacher, getCourse, getCourseVideos, getcourseTeacher, stdEnrolledCoursesClasses, teacherEnrolledCoursesClasses } from "../controllers/course.controller.js";
import { authSTD } from "../middlewares/stdAuth.middleware.js";
import { authTeacher } from "../middlewares/teacherAuth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { ApiError } from "../utils/ApiError.js";

const router = Router()

router.route("/all").get(getCourse)

router.route("/:coursename").get(getcourseTeacher)

router.route("/:coursename/create/:id").post(authTeacher, addCourseTeacher)

router.route("/:coursename/:courseID/add/student/:id").post(authSTD, addCourseStudent)

router.route("/:coursename/:courseID/verify/student/:id").post(authSTD, canStudentEnroll)

router.route("/student/:id/enrolled").get(authSTD, enrolledcourseSTD)

router.route("/teacher/:id/enrolled").get(authTeacher, enrolledcourseTeacher)

router.route("/:courseId/teacher/:teacherId/add-class").post(authTeacher, addClass)

router.route("/classes/student/:studentId").get(authSTD, stdEnrolledCoursesClasses)

router.route("/classes/teacher/:teacherId").get(authTeacher, teacherEnrolledCoursesClasses)

router.route("/:courseId/videos").get(
    async (req, res, next) => {
        try {
            // Try teacher auth first since they're more likely to access videos
            await authTeacher(req, res, () => {
                next();
            });
        } catch (error) {
            try {
                // If teacher auth fails, try student auth
                await authSTD(req, res, () => {
                    next();
                });
            } catch (innerError) {
                next(new ApiError(401, "Authentication required"));
            }
        }
    },
    getCourseVideos
);

router.route("/:courseId/upload-video").post(
    authTeacher,
    upload.single('video'),
    addCourseVideo
);

export default router;