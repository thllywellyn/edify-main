import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';

function CourseVideos({ courseId }) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { fetchWithToken, user } = useAuth();

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetchWithToken(`/api/course/${courseId}/videos`);
        const data = await response.json();
        
        if (response.ok) {
          setVideos(data.data.videos || []);
        } else {
          throw new Error(data.message || 'Failed to fetch videos');
        }
      } catch (error) {
        setError(error.message);
        console.error('Error fetching videos:', error);
      } finally {
        setLoading(false);
      }
    };

    if (courseId && user) {
      fetchVideos();
    }
  }, [courseId, user, fetchWithToken]);

  if (loading) {
    return <div className="text-white text-center py-8">Loading videos...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-8">Error: {error}</div>;
  }

  if (!videos.length) {
    return <div className="text-gray-400 text-center py-8">No videos available for this course yet.</div>;
  }

  return (
    <div className="space-y-4">
      {videos.map((video, index) => (
        <div key={index} className="bg-[#0E3A59] rounded-lg p-4 border border-[#9433E0]/20">
          <h3 className="text-lg font-semibold text-white mb-2">{video.title}</h3>
          <p className="text-gray-300 mb-4">{video.description}</p>
          <video
            controls
            className="w-full rounded-lg"
            src={video.url}
          >
            Your browser does not support the video tag.
          </video>
        </div>
      ))}
    </div>
  );
}

export default CourseVideos;