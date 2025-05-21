import React, { useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import StudentDocument from '../../Components/DocumentVerification/StudentDocument';
import TeacherDocument from '../../Components/DocumentVerification/TeacherDocument';
import DashboardCard from './DashboardCard';

function DocumentUploadTab({ userType }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { ID } = useParams();

  const actualUserType = user?.type?.toLowerCase() || '';
  const expectedUserType = userType?.toLowerCase() || '';

  // Redirect if user type doesn't match the dashboard type
  useEffect(() => {
    if (actualUserType && actualUserType !== expectedUserType) {
      navigate(`/dashboard/${actualUserType}/${ID}/documents`);
    }
  }, [actualUserType, expectedUserType, ID, navigate]);

  if (!user) return null;

  const needsDocuments = (
    (user.type === 'student' && !user.Studentdetails) ||
    (user.type === 'teacher' && !user.Teacherdetails) ||
    ['pending', 'rejected', 'reupload'].includes(user.Isapproved) ||
    !user.Isapproved
  );

  if (!needsDocuments) {
    return (
      <DashboardCard>
        <div className="text-center py-8">
          <h3 className="text-[#4E84C1] text-xl font-semibold mb-4">Documents Verified</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Your documents have been verified successfully. You can now access all platform features.
          </p>
        </div>
      </DashboardCard>
    );
  }

  const getStatusMessage = () => {
    if (!user.Studentdetails && !user.Teacherdetails) {
      return "Please complete your profile by uploading the required documents.";
    }
    switch (user.Isapproved) {
      case 'pending':
        return "Your documents are under review. We'll notify you once they're approved.";
      case 'rejected':
        return "Your documents were rejected. Please check the remarks and resubmit.";
      case 'reupload':
        return "Please reupload your documents with the requested changes.";
      default:
        return "Document verification is required to access platform features.";
    }
  };

  // Only render if user type matches the dashboard type
  if (actualUserType !== expectedUserType) {
    return null;
  }

  return (
    <div className="space-y-6">
      <DashboardCard>
        <div className="bg-white/5 backdrop-blur-md p-6">
          <h3 className="text-[#4E84C1] text-xl font-semibold mb-4">
            Document Verification Status
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {getStatusMessage()}
          </p>
          {user.Remarks && (
            <div className="bg-yellow-500/10 text-yellow-500 p-4 rounded-lg mb-6">
              <strong>Remarks:</strong> {user.Remarks}
            </div>
          )}
        </div>
      </DashboardCard>

      <DashboardCard>
        {actualUserType === 'student' ? (
          <StudentDocument userId={user._id} />
        ) : (
          <TeacherDocument userId={user._id} />
        )}
      </DashboardCard>
    </div>
  );
}

export default DocumentUploadTab;
