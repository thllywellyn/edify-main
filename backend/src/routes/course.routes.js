import { Router } from "express";
import { addClass, addCourseStudent, addCourseTeacher, addCourseVideo, canStudentEnroll, enrolledcourseSTD, enrolledcourseTeacher, getCourse, getCourseVideos, getcourseTeacher, stdEnrolledCoursesClasses, teacherEnrolledCoursesClasses, updateVideoVisibility, updateCourse } from "../controllers/course.controller.js";
import { authSTD } from "../middlewares/stdAuth.middleware.js";
import { authTeacher } from "../middlewares/teacherAuth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { ApiError } from "../utils/ApiError.js";

const router = Router();

// Public routes
router.route("/all").get(getCourse);
router.route("/:coursename").get(getcourseTeacher);

// Video routes (using query params for auth)
router.route("/:courseId/videos").get(getCourseVideos);
router.route("/:courseId/upload-video").post(authTeacher, upload.single('video'), addCourseVideo);
router.route("/:courseId/videos/:videoId/visibility").patch(authTeacher, updateVideoVisibility);

// Protected routes - Teacher
router.route("/:coursename/create/:id").post(authTeacher, addCourseTeacher);
router.route("/teacher/:id/enrolled").get(authTeacher, enrolledcourseTeacher);
router.route("/:courseId/teacher/:teacherId/add-class").post(authTeacher, addClass);
router.route("/classes/teacher/:teacherId").get(authTeacher, teacherEnrolledCoursesClasses);
router.route("/:courseId").put(authTeacher, updateCourse);

// Protected routes - Student
router.route("/:coursename/:courseID/add/student/:id").post(authSTD, addCourseStudent);
router.route("/:coursename/:courseID/verify/student/:id").post(authSTD, canStudentEnroll);
router.route("/student/:id/enrolled").get(authSTD, enrolledcourseSTD);
router.route("/classes/student/:studentId").get(authSTD, stdEnrolledCoursesClasses);

export default router;