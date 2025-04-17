import React, { useState } from 'react';

const FileUpload = ({ label, onFileChange, value }) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  const uploadFile = async (file) => {
    setIsUploading(true);
    setError('');
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8000/api/upload', {
        method: 'POST',
        body: formData,
        onUploadProgress: (progressEvent) => {
          const progress = (progressEvent.loaded / progressEvent.total) * 100;
          setUploadProgress(Math.round(progress));
        },
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      setIsUploading(false);
      setUploadProgress(100);
      onFileChange(data.url); // Assuming your API returns { url: "file_url" }
    } catch (error) {
      console.error('Upload error:', error);
      setError('Failed to upload file');
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('File size should be less than 5MB');
        return;
      }
      uploadFile(file);
    }
  };

  const handleRemoveFile = () => {
    onFileChange('');
    setUploadProgress(0);
    setError('');
  };

  return (
    <div className="mb-4">
      <label className="text-white ml-7 font-bold">{label}</label>
      <div className="mt-3 relative">
        <input
          type="file"
          accept="image/jpeg,image/png,application/pdf"
          className="absolute inset-0 z-50 opacity-0 cursor-pointer"
          onChange={handleFileChange}
          disabled={isUploading}
        />
        <div className="relative z-0 flex items-center justify-between w-80 py-3 px-7 border-2 text-[#e5e5e5] rounded-md">
          <span className="truncate">
            {value ? 'File uploaded' : 'Choose file'}
          </span>
          {value && (
            <button
              onClick={handleRemoveFile}
              className="bg-red-500 text-white px-2 py-1 rounded-sm ml-2"
              type="button"
            >
              Remove
            </button>
          )}
        </div>
        {isUploading && (
          <div className="mt-2">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <div className="text-sm text-gray-500 mt-1">
              Uploading: {uploadProgress}%
            </div>
          </div>
        )}
        {error && (
          <div className="text-red-500 text-sm mt-1">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
