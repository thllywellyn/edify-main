import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Modal from '../Components/Modal';

function VideoUpload({ onClose, courseId }) {
  const { ID } = useParams();
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !title || !description) {
      alert('Please fill in all fields');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('video', file);
    formData.append('title', title);
    formData.append('description', description);

    try {
      const response = await fetch(`/api/course/${courseId}/upload-video`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to upload video');
      }

      alert('Video uploaded successfully');
      onClose();
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title="Upload Course Video" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700 dark:text-gray-300 mb-2">
            Video Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter video title"
            className="w-full px-3 py-2 rounded-md bg-gray-50 dark:bg-[#042439] border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#4E84C1]"
          />
        </div>

        <div>
          <label className="block text-gray-700 dark:text-gray-300 mb-2">
            Video Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter video description"
            className="w-full px-3 py-2 rounded-md bg-gray-50 dark:bg-[#042439] border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#4E84C1]"
            rows="3"
          />
        </div>

        <div>
          <label className="block text-gray-700 dark:text-gray-300 mb-2">
            Video File
          </label>
          <div className="flex items-center justify-center w-full">
            <label className="w-full flex flex-col items-center px-4 py-6 bg-gray-50 dark:bg-[#042439] text-gray-500 dark:text-gray-400 rounded-lg tracking-wide border-2 border-dashed border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-[#031c2e]">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"></path>
              </svg>
              <span className="mt-2 text-sm">
                {file ? file.name : 'Select a video file'}
              </span>
              <input
                type="file"
                className="hidden"
                accept="video/*"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </label>
          </div>
        </div>

        {file && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Selected file: {file.name}
          </p>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-[#4E84C1] hover:bg-[#3a6da3] text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Uploading...' : 'Upload Video'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default VideoUpload;