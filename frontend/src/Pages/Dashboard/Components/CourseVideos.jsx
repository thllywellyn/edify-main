import React, { useEffect, useState } from 'react';
import Alert from './Alert';
import Card from './Card';
import { FaPlay, FaEye, FaEyeSlash, FaLock } from 'react-icons/fa';
import Modal from './Modal';
import { useAuth } from '../../../context/AuthContext';

const CourseVideos = ({ courseId, studentId }) => {
  const { user } = useAuth();
  const [videos, setVideos] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isTeacher, setIsTeacher] = useState(false);

  const fetchVideos = async () => {
    if (!courseId) {
      setLoading(false);
      setError('Invalid course');
      return;
    }

    try {
      const queryParams = user?.type === 'teacher' 
        ? `teacherId=${user._id}`
        : `studentId=${studentId}`;

      const response = await fetch(`/api/course/${courseId}/videos?${queryParams}`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to fetch videos');
      }

      const data = await response.json();
      setVideos(data.data?.videos || []);
      setIsTeacher(data.data?.isTeacher || false);
      setError('');
    } catch (error) {
      console.error('Error fetching videos:', error);
      setError(error.message || 'Unable to load videos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, [courseId, studentId, user]);

  const toggleVideoVisibility = async (videoId, currentStatus) => {
    try {
      const response = await fetch(`/api/course/${courseId}/videos/${videoId}/visibility`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ isPublished: !currentStatus }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to update video visibility');
      }

      await fetchVideos();
    } catch (error) {
      setError(error.message || 'Failed to update video visibility');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4E84C1]"></div>
      </div>
    );
  }

  if (error) {
    return <Alert type="error" message={error} />;
  }

  if (videos.length === 0) {
    return (
      <Card className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">
          {isTeacher ? 'No videos uploaded yet. Add your first video!' : 'No videos available for this course yet.'}
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        {videos.map((video) => (
          <Card
            key={video._id}
            className="hover:bg-gray-50 dark:hover:bg-[#042439] transition-colors"
          >
            <div className="flex items-center justify-between">
              <div 
                className="flex items-center space-x-4 flex-1 cursor-pointer"
                onClick={() => video.isPublished || isTeacher ? setSelectedVideo(video) : null}
              >
                <div className={`p-2 rounded-lg ${video.isPublished || isTeacher ? 'bg-[#4E84C1]/10' : 'bg-gray-200 dark:bg-gray-700'}`}>
                  {video.isPublished || isTeacher ? (
                    <FaPlay className="h-6 w-6 text-[#4E84C1]" />
                  ) : (
                    <FaLock className="h-6 w-6 text-gray-400" />
                  )}
                </div>
                <div>
                  <h4 className={`font-medium ${video.isPublished || isTeacher ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>
                    {video.title}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {video.description}
                  </p>
                </div>
              </div>
              
              {isTeacher && (
                <button
                  onClick={() => toggleVideoVisibility(video._id, video.isPublished)}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  title={video.isPublished ? 'Hide from students' : 'Make visible to students'}
                >
                  {video.isPublished ? <FaEye className="h-5 w-5" /> : <FaEyeSlash className="h-5 w-5" />}
                </button>
              )}
            </div>
          </Card>
        ))}
      </div>

      {selectedVideo && (
        <Modal 
          title={selectedVideo.title} 
          onClose={() => setSelectedVideo(null)}
          className="max-w-4xl"
        >
          <div className="aspect-video bg-black rounded-lg overflow-hidden">
            <iframe
              src={selectedVideo.url}
              title={selectedVideo.title}
              className="w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            {selectedVideo.description}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default CourseVideos;