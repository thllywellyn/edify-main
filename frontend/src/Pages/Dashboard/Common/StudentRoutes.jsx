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

  // Check if user exists and is authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Ensure we have an ID
  if (!ID) {
    return <Navigate to={`/dashboard/student/${user._id}/documents`} replace />;
  }

  // If user needs to upload/re-upload documents, redirect to documents tab
  const needsDocuments = !user?.Studentdetails || 
    ['pending', 'rejected', 'reupload'].includes(user?.Isapproved);

  // Only redirect to documents if not already there and documents are needed
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
