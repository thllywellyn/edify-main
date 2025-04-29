import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import StudentDocument from './StudentDocument';
import TeacherDocument from './TeacherDocument';

const DocumentUploadWrapper = () => {
    const { user } = useAuth();

    if (!user) return null;

    // Show document upload form if:
    // 1. User has no documents uploaded (Studentdetails/Teacherdetails is null)
    // 2. User's documents are in pending or rejected state
    // 3. User is not yet approved
    const shouldShowForm = (
        (user.type === 'student' && !user.Studentdetails) ||
        (user.type === 'teacher' && !user.Teacherdetails) ||
        ['pending', 'rejected'].includes(user.Isapproved) ||
        !user.Isapproved
    );

    if (!shouldShowForm) {
        return null;
    }

    return (
        <div className="bg-[#042439] w-full rounded-lg shadow-xl">
            {user.type === 'student' ? (
                <StudentDocument />
            ) : (
                <TeacherDocument />
            )}
        </div>
    );
};

export default DocumentUploadWrapper;