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

  // Ensure correct routing based on user type
  useEffect(() => {
    if (actualUserType && actualUserType !== expectedUserType) {
      navigate(`/dashboard/${actualUserType}/${ID}/documents`);
    }
  }, [actualUserType, expectedUserType, ID, navigate]);

  if (!user) return null;

  const needsDocuments = (
    !user.Isapproved ||
    ['pending', 'rejected', 'reupload'].includes(user.Isapproved) ||
    (user.type === 'student' && (!user.Studentdetails || user.Studentdetails === null)) ||
    (user.type === 'teacher' && (!user.Teacherdetails || user.Teacherdetails === null))
  );

  const getStatusMessage = () => {
    if (!user.Studentdetails && !user.Teacherdetails) {
      return "Please complete your profile by uploading the required documents.";
    }
    switch (user.Isapproved) {
      case 'pending':
        return "Your documents are under review. We'll notify you once they're approved.";
      case 'rejected':
        return "Your documents were rejected. Please review the remarks and resubmit.";
      case 'reupload':
        return "Please reupload your documents with the requested changes.";
      case 'approved':
        return "Your documents have been verified successfully.";
      default:
        return "Document verification is required to access platform features.";
    }
  };

  if (!needsDocuments) {
    return (
      <DashboardCard>
        <div className="bg-white/5 backdrop-blur-md p-6">
          <h3 className="text-[#4E84C1] text-xl font-semibold mb-4">Documents Verified</h3>
          <p className="text-gray-300">
            Your documents have been verified successfully. You can now access all platform features.
          </p>
        </div>
      </DashboardCard>
    );
  }

  return (
    <div className="space-y-6">
      <DashboardCard>
        <div className="bg-white/5 backdrop-blur-md p-6">
          <h3 className="text-[#4E84C1] text-xl font-semibold mb-4">
            Document Verification Status
          </h3>
          <p className="text-gray-300 mb-6">
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
