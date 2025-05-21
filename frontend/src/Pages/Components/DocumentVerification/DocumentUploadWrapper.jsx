import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import UnifiedDocumentUpload from '../DocumentUpload/UnifiedDocumentUpload';

const DocumentUploadWrapper = () => {
    const { user } = useAuth();

    if (!user) return null;

    // Show document upload form if:
    // 1. User has no documents uploaded (Studentdetails/Teacherdetails is null)
    // 2. User's documents are in pending or rejected state
    // 3. User is not yet approved
    const shouldShowForm = (
        !user.Isapproved ||
        ['pending', 'rejected', 'reupload'].includes(user.Isapproved) ||
        (user.type === 'student' && (!user.Studentdetails || user.Studentdetails === null)) ||
        (user.type === 'teacher' && (!user.Teacherdetails || user.Teacherdetails === null))
    );

    if (!shouldShowForm) {
        return (
            <div className="bg-[#042439] p-6 rounded-lg">
                <h2 className="text-[#4E84C1] text-xl mb-4">Document Status</h2>
                <p className="text-gray-300">
                    Your documents have been approved. No further action is required.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-[#042439] w-full rounded-lg shadow-xl">
            <UnifiedDocumentUpload />
        </div>
    );
};

export default DocumentUploadWrapper;