import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardTeacher from '../TeacherDashboard/DashboardTeacher';
import TeacherCourses from '../TeacherDashboard/TeacherCourses';
import TeacherClasses from '../TeacherDashboard/TeacherClasses';
import DocumentVerificationTab from '../Components/DocumentVerificationTab';

function TeacherRoutes() {
  return (
    <Routes>
      <Route path="documents" element={<DocumentVerificationTab />} />
      <Route path="home" element={<DashboardTeacher />} />
      <Route path="courses" element={<TeacherCourses />} />
      <Route path="classes" element={<TeacherClasses />} />
    </Routes>
  );
}

export default TeacherRoutes;
