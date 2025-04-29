import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Popup from './Popup';
import CourseVideos from '../Components/CourseVideos';
import CourseCard from '../Components/CourseCard';
import DashboardCard from '../Components/DashboardCard';
import { useAuth } from '../../../context/AuthContext';

function StudentCourses() {
  const { ID } = useParams();
  const { user, fetchWithToken } = useAuth();
  const [data, setData] = useState([]);
  const [popup, setPopup] = useState(false);
  const [subDetails, setsubDetails] = useState({});
  const [subD, setsubD] = useState();
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      if (!user || user._id !== ID) {
        setError('Please log in to view your courses');
        setLoading(false);
        return;
      }

      try {
        const response = await fetchWithToken(`/api/course/student/${ID}/enrolled`);

        if (!response.ok) {
          throw new Error('Failed to fetch enrolled courses');
        }

        const userData = await response.json();
        setData(userData.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching courses:', error);
        setError(error.message);
        setLoading(false);
      }
    };
    getData();
  }, [ID, user, fetchWithToken]);

  const openpopup = (course) => {
    setsubDetails(course);
    setPopup(true);
  };

  if (loading) {
    return (
      <DashboardCard>
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4E84C1]"></div>
        </div>
      </DashboardCard>
    );
  }

  if (error) {
    return (
      <DashboardCard>
        <div className="text-center p-6">
          <p className="text-red-500 dark:text-red-400">{error}</p>
        </div>
      </DashboardCard>
    );
  }

  return (
    <div className="space-y-6">
      <DashboardCard>
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          My Courses
        </h1>
      </DashboardCard>

      {data.length > 0 ? (
        <DashboardCard>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {data.map(course => (
              <div key={course._id}>
                <CourseCard
                  course={course}
                  showVideos={selectedCourse === course._id}
                  onVideoClick={() => setSelectedCourse(selectedCourse === course._id ? null : course._id)}
                  onDetailsClick={() => openpopup(course)}
                />
                {selectedCourse === course._id && (
                  <div className="mt-4 p-4 bg-gray-50 dark:bg-[#042439] rounded-lg">
                    <CourseVideos courseId={course._id} studentId={ID} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </DashboardCard>
      ) : (
        <DashboardCard>
          <div className="text-center py-8">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              No Courses Found
            </h3>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              You haven't enrolled in any courses yet. Browse available courses to get started.
            </p>
          </div>
        </DashboardCard>
      )}

      {popup && (
        <Popup
          onClose={() => setPopup(false)}
          details={subDetails}
        />
      )}
    </div>
  );
}

export default StudentCourses;