import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import UnifiedDocumentUpload from '../../Components/DocumentUpload/UnifiedDocumentUpload';

const DocumentVerificationTab = () => {
  const { user } = useAuth();

  if (!user) return null;

  const getStatusMessage = () => {
    if (!user.Studentdetails && !user.Teacherdetails) {
      return {
        title: "Document Verification Required",
        message: "Please submit your documents to complete your profile verification.",
        type: "info"
      };
    }

    switch (user.Isapproved) {
      case 'approved':
        return {
          title: "Documents Verified",
          message: "Your documents have been verified successfully.",
          type: "success"
        };
      case 'pending':
        return {
          title: "Under Review",
          message: "Your documents are currently being reviewed by our team.",
          type: "warning"
        };
      case 'rejected':
        return {
          title: "Verification Failed",
          message: "Your documents were not approved. Please review the remarks and resubmit.",
          type: "error"
        };
      case 'reupload':
        return {
          title: "Re-upload Required",
          message: "Please re-upload your documents with the requested changes.",
          type: "warning"
        };
      default:
        return {
          title: "Document Verification",
          message: "Please complete your document verification to access all features.",
          type: "info"
        };
    }
  };

  const status = getStatusMessage();
  const needsDocuments = !user.Isapproved || ['pending', 'rejected', 'reupload'].includes(user.Isapproved);

  return (
    <div className="space-y-6">
      <div className="bg-gray-900/50 backdrop-blur-lg rounded-xl p-6 shadow-xl">
        <div className={`p-4 ${
          status.type === 'success' ? 'bg-green-500/10 border-green-500/50' :
          status.type === 'warning' ? 'bg-yellow-500/10 border-yellow-500/50' :
          status.type === 'error' ? 'bg-red-500/10 border-red-500/50' :
          'bg-blue-500/10 border-blue-500/50'
        } border rounded-lg`}>
          <h2 className={`text-xl font-semibold mb-2 ${
            status.type === 'success' ? 'text-green-400' :
            status.type === 'warning' ? 'text-yellow-400' :
            status.type === 'error' ? 'text-red-400' :
            'text-blue-400'
          }`}>
            {status.title}
          </h2>
          <p className="text-gray-300">{status.message}</p>
          {user.Remarks && (
            <div className="mt-4 p-3 bg-gray-800/50 rounded-lg">
              <span className="text-gray-400">Remarks: </span>
              <span className="text-gray-300">{user.Remarks}</span>
            </div>
          )}
        </div>
      </div>

      {needsDocuments && <UnifiedDocumentUpload />}
    </div>
  );
};

export default DocumentVerificationTab;
