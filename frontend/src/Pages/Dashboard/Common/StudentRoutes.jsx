import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DocumentUploadTab from '../Components/DocumentUploadTab';
import StudentDashboard from '../StudentDashboard/StudentDashboard';
import StudentCourses from '../StudentDashboard/StudentCourses';
import SearchTeacher from '../StudentDashboard/SearchTeacher';

function StudentRoutes() {
  return (
    <Routes>
      <Route path="documents" element={<DocumentUploadTab />} />
      <Route path="home" element={<StudentDashboard />} />
      <Route path="search" element={<SearchTeacher />} />
      <Route path="courses" element={<StudentCourses />} />
    </Routes>
  );
}

export default StudentRoutes;
