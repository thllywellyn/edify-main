import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import ProfileCard from '../Components/ProfileCard';
import UnifiedDocumentUpload from '../../Components/DocumentUpload/UnifiedDocumentUpload';

function StudentDashboard() {
  const { ID } = useParams();
  const { user, fetchWithToken } = useAuth();
  const [error, setError] = useState(null);

  // Use the user data directly from context
  useEffect(() => {
    if (!user || user._id !== ID) {
      setError('Unauthorized access');
    }
  }, [ID, user]);

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <ProfileCard user={user} userType="Student" />
      {(!user.Studentdetails || user.Isapproved !== 'approved') && (
        <div className="bg-white/5 backdrop-blur-md rounded-xl p-6">
          <h3 className="text-[#4E84C1] text-xl font-semibold mb-4">Document Verification Required</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Please complete your profile by uploading the required documents to access all features.
          </p>
          <UnifiedDocumentUpload />
        </div>
      )}
    </div>
  );
}

export default StudentDashboard;