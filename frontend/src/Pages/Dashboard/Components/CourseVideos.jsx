import React, { useEffect, useState } from 'react';
import Button from './Button';
import Alert from './Alert';
import Card from './Card';
import { FaPlay, FaUpload } from 'react-icons/fa';

const CourseVideos = ({ courseId }) => {
  const [videos, setVideos] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch(`/api/course/${courseId}/videos`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch videos');
        }

        const data = await response.json();
        setVideos(data.data?.videos || []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchVideos();
    }
  }, [courseId]);

  const formatDuration = (seconds) => {
    if (!seconds) return '--:--';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4E84C1]"></div>
      </div>
    );
  }

  if (error) {
    return <Alert type="error" message={error} />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Course Videos ({videos.length})
        </h3>
      </div>

      {videos.length === 0 ? (
        <Card className="text-center py-8">
          <div className="flex flex-col items-center space-y-2">
            <FaUpload className="h-8 w-8 text-gray-400" />
            <p className="text-gray-500 dark:text-gray-400">
              No videos have been uploaded for this course yet.
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {videos.map((video) => (
            <Card
              key={video._id}
              className="hover:bg-gray-50 dark:hover:bg-[#042439] transition-colors"
            >
              <div className="flex items-start space-x-4">
                <div className="p-2 bg-[#4E84C1]/10 rounded-lg">
                  <FaPlay className="h-6 w-6 text-[#4E84C1]" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-base font-medium text-gray-900 dark:text-white truncate">
                    {video.title}
                  </h4>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                    {video.description}
                  </p>
                  <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400 space-x-4">
                    <span>Duration: {formatDuration(video.duration)}</span>
                    <span>•</span>
                    <span>Uploaded on {new Date(video.uploadedAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  as="a"
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0"
                >
                  Watch
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseVideos;