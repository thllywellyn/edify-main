import { Router } from "express";
import { adminLogin, adminLogout, adminSignUp, approveStudent, approveTeacher, checkStudentDocuments, checkTeacherDocuments, forApproval, sendmessage, allmessages, readMessage, toapproveCourse, approveCourse, refreshAccessToken } from "../controllers/admin.controller.js";
import { authAdmin } from "../middlewares/adminAuth.middleware.js";

const router = Router()

router.route("/signup").post(adminSignUp)

router.route("/login").post(adminLogin)

router.route("/:adminID/approve").post(authAdmin, forApproval)

router.route("/:adminID/approve/student/:studentID").post(authAdmin, approveStudent)

router.route("/:adminID/approve/teacher/:teacherID").post(authAdmin,approveTeacher)

router.route("/:adminID/documents/student/:studentID").get(authAdmin, checkStudentDocuments)

router.route("/:adminID/documents/teacher/:teacherID").get(authAdmin, checkTeacherDocuments)

router.route("/logout").post(authAdmin, adminLogout)

router.route("/contact-us").post(sendmessage)

router.route("/messages/all").get(authAdmin, allmessages)

router.route("/message/read").patch(authAdmin, readMessage)

router.route("/:adminID/approve/course").get(authAdmin, toapproveCourse)

router.route("/:adminID/approve/course/:courseID").post(authAdmin, approveCourse)

router.route("/refresh-token").post(refreshAccessToken)

export default router;

//testing