import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import ProfileCard from '../Components/ProfileCard';
import DocumentUploadWrapper from '../../Components/DocumentVerification/DocumentUploadWrapper';

function StudentDashboard() {
  const { ID } = useParams();
  const { user, fetchWithToken } = useAuth();
  const [data, setdata] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetchWithToken(`/api/Student/StudentDocument/${ID}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Please log in to access your dashboard');
          }
          throw new Error('Failed to fetch data');
        }

        const user = await response.json();
        setdata(user.data);
      } catch (error) {
        setError(error.message);
        console.error('Dashboard error:', error);
      }
    };

    if (user && user._id === ID) {
      getData();
    } else {
      setError('Unauthorized access');
    }
  }, [ID, user, fetchWithToken]);

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <ProfileCard user={data} userType="Student" />
      {(!data.Studentdetails || data.Isapproved !== 'approved') && (
        <div className="bg-white/5 backdrop-blur-md rounded-xl p-6">
          <h3 className="text-[#4E84C1] text-xl font-semibold mb-4">Document Verification Required</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Please complete your profile by uploading the required documents to access all features.
          </p>
          <DocumentUploadWrapper />
        </div>
      )}
    </div>
  );
}

export default StudentDashboard;