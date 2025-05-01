import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './Layout'
import Landing from './Pages/Home/Landing/Landing'
import About from './Pages/Home/About/About'
import Contact from './Pages/Home/Contact/Contact'
import Courses from './Pages/Home/Courses/Courses'
import Login from './Pages/Login/Login'
import Signup from './Pages/Signup/Signup'
import AdminLogin from './Pages/Login/AdminLogin'
import StudentDocument from './Pages/Components/DocumentVerification/StudentDocument'
import VarifyEmail from './Pages/Components/VarifyEmail/VarifyEmail'
import Rejected from './Pages/Response/Rejected'
import Pending from './Pages/Response/Pending'
import Admin from './Pages/Components/Admin/Admin'
import AdminApprovals from './Pages/Components/Admin/AdminApprovals'
import AdminCourses from './Pages/Components/Admin/AdminCourses'
import VarifyDoc from './Pages/Components/Admin/VarifyDoc'
import StudentDashboardLayout from './Pages/Dashboard/Common/StudentDashboardLayout'
import TeacherDashboardLayout from './Pages/Dashboard/Common/TeacherDashboardLayout'
import SearchTeacher from './Pages/Dashboard/StudentDashboard/SearchTeacher'
import StudentClasses from './Pages/Dashboard/StudentDashboard/StudentClasses'
import StudentCourses from './Pages/Dashboard/StudentDashboard/StudentCourses'
import DashboardTeacher from './Pages/Dashboard/TeacherDashboard/DashboardTeacher'
import TeacherClasses from './Pages/Dashboard/TeacherDashboard/TeacherClasses'
import TeacherCourses from './Pages/Dashboard/TeacherDashboard/TeacherCourses'
import SearchData from './Pages/Home/Search/Search'
import ErrorPage from './Pages/ErrorPage/ErrorPage'
import Forgetpassword from './Pages/ForgetPassword/Forgetpassword'
import ResetPassword from './Pages/ForgetPassword/ResetPassword'
import ResetTeacher from './Pages/ForgetPassword/ResetTeacher'
import ProtectedRoute from './Pages/Components/ProtectedRoute'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/Search/:subject" element={<SearchData />} />
        <Route path="/StudentDocument/:Data" element={<ProtectedRoute><StudentDocument /></ProtectedRoute>} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/varifyEmail" element={<VarifyEmail />} />
        <Route path="/adminLogin" element={<AdminLogin />} />
        <Route path="/rejected/:user/:ID" element={<Rejected />} />
        <Route path="/pending" element={<Pending />} />

        {/* Admin Routes */}
        <Route path="/admin/:data" element={<ProtectedRoute><Admin /></ProtectedRoute>}>
          <Route index element={<AdminApprovals />} />
          <Route path="courses" element={<AdminCourses />} />
        </Route>
        <Route path="/VarifyDoc/:type/:adminID/:ID" element={<ProtectedRoute><VarifyDoc /></ProtectedRoute>} />

        {/* Student Dashboard */}
        <Route path="/dashboard/student/:ID" element={<ProtectedRoute><StudentDashboardLayout /></ProtectedRoute>}>
          <Route path="search" element={<SearchTeacher />} />
          <Route path="classes" element={<StudentClasses />} />
          <Route path="courses" element={<StudentCourses />} />
        </Route>

        {/* Teacher Dashboard */}
        <Route path="/dashboard/teacher/:ID" element={<ProtectedRoute><TeacherDashboardLayout /></ProtectedRoute>}>
          <Route path="home" element={<DashboardTeacher />} />
          <Route path="classes" element={<TeacherClasses />} />
          <Route path="courses" element={<TeacherCourses />} />
        </Route>

        {/* Password Reset Routes */}
        <Route path="/forgetPassword" element={<Forgetpassword />} />
        <Route path="/student/forgetPassword/:token" element={<ResetPassword />} />
        <Route path="/teacher/forgetPassword/:token" element={<ResetTeacher />} />
        
        {/* 404 Route */}
        <Route path="*" element={<ErrorPage />} />
      </Route>
    </Routes>
  )
}

export default App