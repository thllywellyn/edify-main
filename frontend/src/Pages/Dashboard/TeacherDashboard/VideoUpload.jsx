import React, { useState } from 'react';

function VideoUpload({ courseId, onClose }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !videoFile) {
      alert('Please fill in all fields and select a video file');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('video', videoFile);

    try {
      const response = await fetch(`/api/course/${courseId}/upload-video`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        alert('Video uploaded successfully!');
        onClose();
      } else {
        throw new Error(data.message || 'Failed to upload video');
      }
    } catch (error) {
      alert('Error uploading video: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-[#042439] text-white rounded-lg p-6 w-[500px]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Upload Course Video</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 rounded bg-[#0E3A59] border border-[#9433E0]/20"
              required
            />
          </div>

          <div>
            <label className="block mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 rounded bg-[#0E3A59] border border-[#9433E0]/20 h-24"
              required
            />
          </div>

          <div>
            <label className="block mb-1">Video File</label>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setVideoFile(e.target.files[0])}
              className="w-full p-2 rounded bg-[#0E3A59] border border-[#9433E0]/20"
              required
            />
          </div>

          <button
            type="submit"
            disabled={uploading}
            className="w-full bg-[#9433E0] hover:bg-[#7928b8] text-white py-2 rounded-md disabled:opacity-50"
          >
            {uploading ? 'Uploading...' : 'Upload Video'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default VideoUpload;