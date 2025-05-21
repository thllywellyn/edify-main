import React from 'react';
import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import StudentDashboard from '../StudentDashboard/StudentDashboard';
import StudentCourses from '../StudentDashboard/StudentCourses';
import SearchTeacher from '../StudentDashboard/SearchTeacher';
import DocumentVerificationTab from '../Components/DocumentVerificationTab';
import { useAuth } from '../../../context/AuthContext';

function StudentRoutes() {
  const { user } = useAuth();
  const { ID } = useParams();

  // If user needs to upload/re-upload documents, redirect to documents tab
  const needsDocuments = !user?.Studentdetails || 
    ['pending', 'rejected', 'reupload'].includes(user?.Isapproved);

  if (needsDocuments && !window.location.pathname.includes('/documents')) {
    return <Navigate to={`/dashboard/student/${ID}/documents`} replace />;
  }

  return (
    <Routes>
      <Route path="documents" element={<DocumentVerificationTab />} />
      <Route path="home" element={<StudentDashboard />} />
      <Route path="search" element={<SearchTeacher />} />
      <Route path="courses" element={<StudentCourses />} />
    </Routes>
  );
}

export default StudentRoutes;
