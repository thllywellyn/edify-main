import { Router } from "express";
import { 
    registerTeacher, 
    verifyEmail,
    login, 
    logout, 
    teacherVerification,
    teacherdocuments, 
    ForgetPassword,
    ResetPassword,
    refreshAccessToken
} from "../controllers/teacher.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { authTeacher } from "../middlewares/teacherAuth.middleware.js";
import { authSchema } from "../middlewares/joiLogin.middleware.js";

const router = Router();

router.route("/signup").post(registerTeacher);
router.route("/verify").get(verifyEmail);
router.route("/login").post(authSchema, login);
router.route("/logout").post(authTeacher, logout);
router.route("/refresh-token").post(refreshAccessToken);

router.route("/verification/:id").post(
    authTeacher,
    upload.fields([
        {
            name: "Aadhaar",
            maxCount: 1
        },
        {
            name: "Secondary",
            maxCount: 1
        },
        {
            name: "Higher",
            maxCount: 1
        },
        {
            name: "UG",
            maxCount: 1
        },
        {
            name: "PG",
            maxCount: 1
        }
    ]),
    teacherVerification
);

router.route("/TeacherDocument/:id").get(authTeacher, teacherdocuments);
router.route("/forget-password").post(ForgetPassword);
router.route("/reset-password/:token").post(ResetPassword);

export default router;
