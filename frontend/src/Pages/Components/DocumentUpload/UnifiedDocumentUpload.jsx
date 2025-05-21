import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const FileUploadField = ({ label, id, onChange, value, accept = ".pdf,.jpg,.jpeg,.png" }) => (
  <div className="mb-4">
    <label htmlFor={id} className="block text-sm text-gray-300 mb-2">{label}</label>
    <div className="relative">
      <input
        type="file"
        id={id}
        onChange={onChange}
        accept={accept}
        className="hidden"
      />
      <label
        htmlFor={id}
        className="flex items-center justify-center w-full p-4 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-[#4E84C1] transition-all group"
      >
        <div className="flex flex-col items-center space-y-2">
          <svg 
            className="w-8 h-8 text-gray-400 group-hover:text-[#4E84C1] transition-colors" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
            {value ? value.name : 'Click to upload'}
          </span>
          <span className="text-xs text-gray-500">PDF, JPG, PNG (max 5MB)</span>
        </div>
      </label>
    </div>
  </div>
);

const TextField = ({ label, id, type = "text", value, onChange, required = true, min, max, step }) => (
  <div className="mb-4">
    <label htmlFor={id} className="block text-sm text-gray-300 mb-2">{label}</label>
    <input
      type={type}
      id={id}
      value={value || ''}
      onChange={onChange}
      required={required}
      min={min}
      max={max}
      step={step}
      className="w-full p-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-[#4E84C1] focus:border-transparent text-gray-200"
    />
  </div>
);

const UnifiedDocumentUpload = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    basicInfo: {
      phone: '',
      address: '',
    },
    education: {
      secondary: {
        school: '',
        marks: '',
        certificate: null
      },
      higher: {
        school: '',
        marks: '',
        certificate: null
      }
    },
    additional: {
      aadhaar: null
    }
  });

  const [teacherFields, setTeacherFields] = useState({
    experience: '',
    graduation: {
      college: '',
      marks: '',
      certificate: null
    },
    postGraduation: {
      college: '',
      marks: '',
      certificate: null
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchExistingData = async () => {
      try {
        const endpoint = user.type === 'student' 
          ? `/api/student/StudentDocument/${user._id}`
          : `/api/teacher/TeacherDocument/${user._id}`;

        const response = await fetch(endpoint, {
          credentials: 'include',
          headers: {
                      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                    }
        });

        if (!response.ok) throw new Error('Failed to fetch existing data');

        const data = await response.json();
        // Map the received data to our form structure
        // ... implementation depends on your API response structure
      } catch (error) {
        setError('Failed to load existing data');
        console.error('Error:', error);
      }
    };

    if (user?._id) fetchExistingData();
  }, [user]);

  const handleBasicInfoChange = (field) => (e) => {
    setFormData(prev => ({
      ...prev,
      basicInfo: {
        ...prev.basicInfo,
        [field]: e.target.value
      }
    }));
  };

  const handleFileChange = (category, subcategory = null) => (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('File size should be less than 5MB');
      return;
    }

    if (subcategory) {
      setFormData(prev => ({
        ...prev,
        [category]: {
          ...prev[category],
          [subcategory]: {
            ...prev[category][subcategory],
            certificate: file
          }
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [category]: {
          ...prev[category],
          aadhaar: file
        }
      }));
    }
  };

  const handleEducationChange = (level, field) => (e) => {
    setFormData(prev => ({
      ...prev,
      education: {
        ...prev.education,
        [level]: {
          ...prev.education[level],
          [field]: e.target.value
        }
      }
    }));
  };

  const handleTeacherFieldChange = (category, field = null) => (e) => {
    if (field) {
      setTeacherFields(prev => ({
        ...prev,
        [category]: {
          ...prev[category],
          [field]: e.target.value
        }
      }));
    } else {
      setTeacherFields(prev => ({
        ...prev,
        [category]: e.target.value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const formDataObj = new FormData();
      
      // Append basic info
      Object.entries(formData.basicInfo).forEach(([key, value]) => {
        formDataObj.append(key, value);
      });

      // Append education details
      ['secondary', 'higher'].forEach(level => {
        formDataObj.append(`${level}School`, formData.education[level].school);
                formDataObj.append(`${level}Marks`, formData.education[level].marks);
                if (formData.education[level].certificate) {
                  formDataObj.append(level, formData.education[level].certificate);
                }
      });

      // Append Aadhaar
      if (formData.additional.aadhaar) {
        formDataObj.append('Aadhaar', formData.additional.aadhaar);
      }

      // Add teacher-specific fields if applicable
      if (user.type === 'teacher') {
        formDataObj.append('Experience', teacherFields.experience);
                ['graduation', 'postGraduation'].forEach(level => {
                  formDataObj.append(`${level}College`, teacherFields[level].college);
                  formDataObj.append(`${level}Marks`, teacherFields[level].marks);
                  if (teacherFields[level].certificate) {
                    formDataObj.append(level === 'graduation' ? 'UG' : 'PG', teacherFields[level].certificate);
                  }
                });
      }

      const endpoint = user.type === 'student'
              ? `/api/student/Verification/${user._id}`
              : `/api/teacher/verification/${user._id}`;

      const response = await fetch(endpoint, {
        method: 'POST',
        credentials: 'include',
        body: formDataObj
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to upload documents');
      }

      setSuccessMessage('Documents uploaded successfully');
      setTimeout(() => {
        window.location.reload();
      }, 2000);

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 bg-gradient-to-b from-[#042439] to-[#031824]">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[#4E84C1] mb-2">Document Verification</h1>
          <p className="text-gray-400">Please provide your details and upload the required documents</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-gray-900/50 backdrop-blur-lg rounded-xl p-6 shadow-xl">
            <h2 className="text-xl font-semibold text-[#4E84C1] mb-6">Basic Information</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <TextField
                label="Phone Number"
                id="phone"
                value={formData.basicInfo.phone}
                onChange={handleBasicInfoChange('phone')}
              />
              <TextField
                label="Address"
                id="address"
                value={formData.basicInfo.address}
                onChange={handleBasicInfoChange('address')}
              />
            </div>
          </div>

          {/* Educational Information */}
          <div className="bg-gray-900/50 backdrop-blur-lg rounded-xl p-6 shadow-xl">
            <h2 className="text-xl font-semibold text-[#4E84C1] mb-6">Educational Information</h2>
            
            {/* Secondary Education */}
            <div className="mb-6">
              <h3 className="text-lg text-gray-300 mb-4">Secondary Education (10th)</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <TextField
                  label="School Name"
                  id="secondarySchool"
                  value={formData.education.secondary.school}
                  onChange={handleEducationChange('secondary', 'school')}
                />
                <TextField
                  label="Marks (%)"
                  id="secondaryMarks"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.education.secondary.marks}
                  onChange={handleEducationChange('secondary', 'marks')}
                />
              </div>
              <FileUploadField
                label="Upload Certificate"
                id="secondaryCertificate"
                onChange={handleFileChange('education', 'secondary')}
                value={formData.education.secondary.certificate}
              />
            </div>

            {/* Higher Secondary Education */}
            <div>
              <h3 className="text-lg text-gray-300 mb-4">Higher Secondary Education (12th)</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <TextField
                  label="School Name"
                  id="higherSchool"
                  value={formData.education.higher.school}
                  onChange={handleEducationChange('higher', 'school')}
                />
                <TextField
                  label="Marks (%)"
                  id="higherMarks"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.education.higher.marks}
                  onChange={handleEducationChange('higher', 'marks')}
                />
              </div>
              <FileUploadField
                label="Upload Certificate"
                id="higherCertificate"
                onChange={handleFileChange('education', 'higher')}
                value={formData.education.higher.certificate}
              />
            </div>
          </div>

          {/* Teacher Specific Fields */}
          {user.type === 'teacher' && (
            <div className="bg-gray-900/50 backdrop-blur-lg rounded-xl p-6 shadow-xl">
              <h2 className="text-xl font-semibold text-[#4E84C1] mb-6">Professional Information</h2>
              
              <TextField
                label="Teaching Experience (years)"
                id="experience"
                type="number"
                min="0"
                value={teacherFields.experience}
                onChange={handleTeacherFieldChange('experience')}
              />

              {/* Graduation */}
              <div className="mt-6">
                <h3 className="text-lg text-gray-300 mb-4">Graduation</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <TextField
                    label="College Name"
                    id="graduationCollege"
                    value={teacherFields.graduation.college}
                    onChange={handleTeacherFieldChange('graduation', 'college')}
                  />
                  <TextField
                    label="CGPA"
                    id="graduationMarks"
                    type="number"
                    min="0"
                    max="10"
                    step="0.01"
                    value={teacherFields.graduation.marks}
                    onChange={handleTeacherFieldChange('graduation', 'marks')}
                  />
                </div>
                <FileUploadField
                  label="Upload Certificate"
                  id="graduationCertificate"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setTeacherFields(prev => ({
                      ...prev,
                      graduation: { ...prev.graduation, certificate: file }
                    }));
                  }}
                  value={teacherFields.graduation.certificate}
                />
              </div>

              {/* Post Graduation */}
              <div className="mt-6">
                <h3 className="text-lg text-gray-300 mb-4">Post Graduation</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <TextField
                    label="College Name"
                    id="pgCollege"
                    value={teacherFields.postGraduation.college}
                    onChange={handleTeacherFieldChange('postGraduation', 'college')}
                  />
                  <TextField
                    label="CGPA"
                    id="pgMarks"
                    type="number"
                    min="0"
                    max="10"
                    step="0.01"
                    value={teacherFields.postGraduation.marks}
                    onChange={handleTeacherFieldChange('postGraduation', 'marks')}
                  />
                </div>
                <FileUploadField
                  label="Upload Certificate"
                  id="pgCertificate"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setTeacherFields(prev => ({
                      ...prev,
                      postGraduation: { ...prev.postGraduation, certificate: file }
                    }));
                  }}
                  value={teacherFields.postGraduation.certificate}
                />
              </div>
            </div>
          )}

          {/* Identity Documents */}
          <div className="bg-gray-900/50 backdrop-blur-lg rounded-xl p-6 shadow-xl">
            <h2 className="text-xl font-semibold text-[#4E84C1] mb-6">Identity Document</h2>
            <FileUploadField
              label="Aadhaar Card"
              id="aadhaar"
              onChange={handleFileChange('additional')}
              value={formData.additional.aadhaar}
            />
          </div>

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
              <p className="text-red-400 text-center">{error}</p>
            </div>
          )}

          {successMessage && (
            <div className="p-4 bg-green-500/10 border border-green-500/50 rounded-lg">
              <p className="text-green-400 text-center">{successMessage}</p>
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-[#4E84C1] text-white rounded-lg hover:bg-[#3a6da3] transition-colors 
                       disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle 
                      className="opacity-25" 
                      cx="12" 
                      cy="12" 
                      r="10" 
                      stroke="currentColor" 
                      strokeWidth="4" 
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  Submit Documents
                  <svg 
                    className="w-5 h-5" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth="2" 
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UnifiedDocumentUpload;
