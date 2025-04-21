import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Popup from './Popup';
import CourseVideos from '../Components/CourseVideos';
import CourseCard from '../Components/CourseCard';
import DashboardCard from '../Components/DashboardCard';

function StudentCourses() {
  const { ID } = useParams();
  const [data, setdata] = useState([]);
  const [popup, setPopup] = useState(false);
  const [subDetails, setsubDetails] = useState({});
  const [subD, setsubD] = useState();
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch(`/api/course/student/${ID}/enrolled`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const user = await response.json();
        setdata(user.data);
      } catch (error) {
        console.error(error);
      }
    };
    getData();
  }, [ID]);

  const openpopup = async(sub) => {
    setsubDetails(sub);
    await fetch(`/api/course/${sub.coursename}`)
      .then(res => res.json())
      .then(res => {
        setPopup(true);
        setsubD(res.data);
      });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <DashboardCard>
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
          My Courses
        </h1>
      </DashboardCard>

      {/* Course Grid */}
      {data.length > 0 ? (
        <DashboardCard>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {data.map(course => (
              <div key={course._id}>
                <CourseCard
                  course={course}
                  showVideos={selectedCourse === course._id}
                  onVideoClick={() => setSelectedCourse(selectedCourse === course._id ? null : course._id)}
                  onDetailsClick={openpopup}
                />
                {selectedCourse === course._id && (
                  <div className="mt-4 p-4 bg-gray-50 dark:bg-[#042439] rounded-lg">
                    <CourseVideos courseId={course._id} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </DashboardCard>
      ) : (
        <DashboardCard>
          <div className="text-center py-8">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">No Courses Found</h3>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              You haven't enrolled in any courses yet. Start by searching for teachers and enrolling in their courses.
            </p>
          </div>
        </DashboardCard>
      )}

      {/* Course Details Modal */}
      {popup && (
        <Popup onClose={() => setPopup(false)} subject={subDetails} allSubject={subD} />
      )}
    </div>
  );
}

export default StudentCourses;