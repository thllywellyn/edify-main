import React, { useEffect, useState } from "react";
import Input from "../DocumentVerification/InputComponent/Input.jsx";
import { useNavigate, useParams } from "react-router-dom";
import { RotatingLines } from "react-loader-spinner";
import logo from "../../Images/logo.svg";

const StudentDocument = () => {
  const [data, setdata] = useState([]);
  const [error, setError] = useState("");
  const { Data } = useParams();
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [uploading, setUploading] = useState({});
  const [formData, setFormData] = useState({
    Phone: "",
    Address: "",
    Highesteducation: "",
    SecondarySchool: "",
    HigherSchool: "",
    SecondaryMarks: "",
    HigherMarks: "",
    Aadhaar: null,
    Secondary: null,
    Higher: null,
  });

  useEffect(() => {
    const getData = async () => {
      if (!Data || Data === 'undefined') {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch(`/api/student/StudentDocument/${Data}`, {
          credentials: 'include' // Include cookies in the request
        });
        
        if (response.status === 401) {
          navigate('/login');
          return;
        }
        
        if (!response.ok) throw new Error("Failed to fetch data");
        
        const user = await response.json();
        if (!user.data) {
          throw new Error("No user data found");
        }
        
        setdata(user.data);
      } catch (error) {
        setError(error.message);
        if (error.message.includes("Failed to fetch") || error.message.includes("No user data")) {
          navigate('/login');
        }
      }
    };
    getData();
  }, [Data, navigate]);

  const handleFileChange = async (fileType, e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("File size should be less than 5MB");
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      setError("Please upload a PDF or image file (JPEG/PNG)");
      return;
    }

    setUploading(prev => ({ ...prev, [fileType]: true }));
    setFormData(prev => ({ ...prev, [fileType]: file }));
    setUploading(prev => ({ ...prev, [fileType]: false }));
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoader(true);
    setError("");

    // Validate required fields
    const requiredFields = [
      'Phone', 'Address', 'Highesteducation', 
      'SecondarySchool', 'HigherSchool', 
      'SecondaryMarks', 'HigherMarks'
    ];
    
    const missingFields = requiredFields.filter(field => !formData[field]);
    if (missingFields.length > 0) {
      setError("Please fill in all required fields");
      setLoader(false);
      return;
    }

    // Validate documents
    if (!formData.Aadhaar || !formData.Secondary || !formData.Higher) {
      setError("Please upload all required documents");
      setLoader(false);
      return;
    }

    const formDataObj = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataObj.append(key, formData[key]);
    });

    try {
      const response = await fetch(`/api/student/Verification/${Data}`, {
        method: "POST",
        credentials: 'include', // Include cookies in the request
        body: formDataObj
      });

      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.message || "Failed to upload documents");
      }
      
      navigate("/pending");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#042439]">
      {loader && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg flex flex-col items-center">
            <RotatingLines
              width="50"
              strokeColor="#4E84C1"
              strokeWidth="3"
            />
            <span className="mt-4 text-gray-700">Uploading documents...</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-[#0D286F] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={logo} className="w-12" alt="Edify Logo" />
          <h1 className="text-2xl text-[#4E84C1] font-bold">Edify</h1>
        </div>
        <h2 className="text-white text-xl">Document Verification</h2>
      </div>

      <form onSubmit={handleSubmit} className="max-w-5xl mx-auto p-6 space-y-8">
        {/* Personal Information */}
        <section className="bg-white/5 backdrop-blur-md rounded-xl p-6">
          <h3 className="text-[#4E84C1] text-xl font-semibold mb-6">Personal Information</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <Input
              label="First Name"
              value={data.Firstname}
              readonly
              className="bg-white/10"
            />
            <Input
              label="Last Name"
              value={data.Lastname}
              readonly
              className="bg-white/10"
            />
            <Input
              label="Phone Number"
              type="tel"
              value={formData.Phone}
              onChange={(e) => handleInputChange("Phone", e.target.value)}
              required
            />
            <Input
              label="Highest Education"
              value={formData.Highesteducation}
              onChange={(e) => handleInputChange("Highesteducation", e.target.value)}
              required
            />
            <div className="md:col-span-2">
              <Input
                label="Home Address"
                value={formData.Address}
                onChange={(e) => handleInputChange("Address", e.target.value)}
                required
              />
            </div>
          </div>
        </section>

        {/* Document Upload Section */}
        <section className="bg-white/5 backdrop-blur-md rounded-xl p-6">
          <h3 className="text-[#4E84C1] text-xl font-semibold mb-6">Document Upload</h3>
          
          {/* Aadhaar Upload */}
          <div className="mb-6">
            <label className="block text-white text-sm font-medium mb-2">Aadhaar Card *</label>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <input
                  type="file"
                  onChange={(e) => handleFileChange("Aadhaar", e)}
                  className="hidden"
                  id="aadhaar-upload"
                  accept=".pdf,.jpg,.jpeg,.png"
                />
                <label
                  htmlFor="aadhaar-upload"
                  className="w-full px-4 py-3 border border-gray-300 border-dashed rounded-lg flex items-center justify-center gap-2 cursor-pointer hover:border-[#4E84C1] transition-colors"
                >
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
                  </svg>
                  <span className="text-gray-300">
                    {formData.Aadhaar ? formData.Aadhaar.name : "Upload Aadhaar Card"}
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Educational Documents */}
          <div className="space-y-6">
            {/* Secondary School */}
            <div className="p-6 border border-gray-700 rounded-lg">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-[#0D286F] p-2 rounded">
                  <span className="text-white text-sm">Secondary</span>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <Input
                  placeholder="10th Board Name"
                  value={formData.SecondarySchool}
                  onChange={(e) => handleInputChange("SecondarySchool", e.target.value)}
                  required
                />
                <Input
                  placeholder="Total Marks (%)"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.SecondaryMarks}
                  onChange={(e) => handleInputChange("SecondaryMarks", e.target.value)}
                  required
                />
                <div className="md:col-span-2">
                  <input
                    type="file"
                    onChange={(e) => handleFileChange("Secondary", e)}
                    className="hidden"
                    id="secondary-upload"
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                  <label
                    htmlFor="secondary-upload"
                    className="w-full px-4 py-3 border border-gray-300 border-dashed rounded-lg flex items-center justify-center gap-2 cursor-pointer hover:border-[#4E84C1] transition-colors"
                  >
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
                    </svg>
                    <span className="text-gray-300">
                      {formData.Secondary ? formData.Secondary.name : "Upload 10th Marksheet"}
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Higher Secondary */}
            <div className="p-6 border border-gray-700 rounded-lg">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-[#0D286F] p-2 rounded">
                  <span className="text-white text-sm">Higher Secondary</span>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <Input
                  placeholder="12th Board Name"
                  value={formData.HigherSchool}
                  onChange={(e) => handleInputChange("HigherSchool", e.target.value)}
                  required
                />
                <Input
                  placeholder="Total Marks (%)"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.HigherMarks}
                  onChange={(e) => handleInputChange("HigherMarks", e.target.value)}
                  required
                />
                <div className="md:col-span-2">
                  <input
                    type="file"
                    onChange={(e) => handleFileChange("Higher", e)}
                    className="hidden"
                    id="higher-upload"
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                  <label
                    htmlFor="higher-upload"
                    className="w-full px-4 py-3 border border-gray-300 border-dashed rounded-lg flex items-center justify-center gap-2 cursor-pointer hover:border-[#4E84C1] transition-colors"
                  >
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
                    </svg>
                    <span className="text-gray-300">
                      {formData.Higher ? formData.Higher.name : "Upload 12th Marksheet"}
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </section>

        {error && (
          <div className="bg-red-500/10 text-red-400 p-4 rounded-lg text-center">
            {error}
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loader}
            className="bg-[#4E84C1] text-white px-8 py-3 rounded-lg hover:bg-[#3a6da3] 
                     transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                     flex items-center gap-2"
          >
            {loader ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                Uploading...
              </>
            ) : (
              <>
                Submit Documents
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                </svg>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StudentDocument;
