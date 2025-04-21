import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from '../../../context/AuthContext';
import logo from '../../Images/logo.svg';

const VarifyDoc = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const { type, adminID, ID } = useParams();
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/admin/${adminID}/documents/${type}/${ID}`);
        const result = await response.json();
        setData(result.data);
      } catch (err) {
        setError("Failed to fetch document details.");
      }
    };
    fetchData();
  }, [adminID, type, ID]);

  const handleAction = async (action) => {
    try {
      const response = await fetch(`/api/admin/${adminID}/approve/${type}/${ID}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action }),
      });
      if (response.ok) {
        navigate(`/admin/${adminID}`);
      } else {
        setError("Failed to perform action.");
      }
    } catch (err) {
      setError("An error occurred while performing the action.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#042439] via-[#0a3553] to-[#042439]">
      {/* Navbar */}
      <nav className="bg-white/10 backdrop-blur-md p-4 flex justify-between items-center">
        <div className="flex items-center gap-3 hover:opacity-90 transition-opacity">
          <img src={logo} className="w-12" alt="Edify Logo" />
          <h1 className="text-2xl text-white font-bold">Edify</h1>
        </div>

        <button 
          onClick={logout} 
          className="bg-[#4E84C1] text-white px-6 py-2 rounded-lg hover:bg-[#3a6da3] transition-all duration-200 font-semibold"
        >
          Logout
        </button>
      </nav>

      {/* Main Content */}
      <div className="p-6 md:p-8 lg:p-10">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white border-b-2 border-[#4E84C1] pb-2 inline-block">
            Document Verification
          </h1>
        </div>

        {data ? (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 space-y-6">
              {/* User Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="text-gray-300">
                    <span className="text-white font-medium">Name:</span>{" "}
                    {data.Firstname} {data.Lastname}
                  </div>
                  <div className="text-gray-300">
                    <span className="text-white font-medium">Email:</span>{" "}
                    <span className="text-[#4E84C1]">{data.Email}</span>
                  </div>
                </div>
                {data[`${type}details`]?.Address && (
                  <div className="text-gray-300">
                    <span className="text-white font-medium">Address:</span>{" "}
                    {data[`${type}details`].Address}
                  </div>
                )}
              </div>

              {/* Document Preview */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white">Documents</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {data[`${type}details`]?.Document?.map((doc, index) => (
                    <div key={index} className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-all duration-200">
                      <a 
                        href={doc} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[#4E84C1] hover:text-[#3a6da3] transition-colors flex items-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        View Document {index + 1}
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => handleAction("approved")}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 font-semibold"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleAction("rejected")}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 font-semibold"
                >
                  Reject
                </button>
                <button
                  onClick={() => handleAction("reupload")}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 font-semibold"
                >
                  Request Reupload
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-400">
            Loading document details...
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-500/20 text-red-400 rounded-lg max-w-4xl mx-auto">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default VarifyDoc;
