import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';
import Popup from './Popup';
import VideoUpload from './VideoUpload';
import CourseVideos from '../Components/CourseVideos';
import CourseCard from '../Components/CourseCard';

function TeacherCourses() {
  const [showPopup, setShowPopup] = useState(false);
  const [showVideoUpload, setShowVideoUpload] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [subject, setSubject] = useState('');
  const [courses, setCourses] = useState([]);
  const { ID } = useParams();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(`/api/course/Teacher/${ID}/enrolled`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setCourses(data.data || []);
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, [ID]);

  const handleCourseClick = (course) => {
    setSelectedCourse(course._id === selectedCourse ? null : course._id);
  };

  const createCourse = (sub) => {
    setSubject(sub);
    setShowPopup(true);
  };

  const subjects = [
    { name: 'Physics', icon: '🔭', color: 'bg-blue-100 dark:bg-blue-900/20' },
    { name: 'Chemistry', icon: '⚗️', color: 'bg-green-100 dark:bg-green-900/20' },
    { name: 'Biology', icon: '🧬', color: 'bg-pink-100 dark:bg-pink-900/20' },
    { name: 'Math', icon: '📐', color: 'bg-yellow-100 dark:bg-yellow-900/20' },
    { name: 'Computer', icon: '💻', color: 'bg-purple-100 dark:bg-purple-900/20' },
  ];

  return (
    <div className="space-y-8">
      {/* Create Course Section */}
      <div className="bg-white dark:bg-[#0a3553] rounded-lg shadow-sm">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Create New Course
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {subjects.map((sub) => (
              <button
                key={sub.name}
                onClick={() => createCourse(sub.name)}
                className={`p-6 ${sub.color} rounded-lg hover:opacity-90 transition-all group`}
              >
                <div className="flex flex-col items-center space-y-3">
                  <span className="text-3xl">{sub.icon}</span>
                  <span className="text-base font-medium text-gray-900 dark:text-white group-hover:text-[#4E84C1]">
                    {sub.name}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Active Courses */}
      {courses.filter(course => course.isapproved).length > 0 && (
        <div className="bg-white dark:bg-[#0a3553] rounded-lg shadow-sm">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Active Courses
            </h2>
            <div className="space-y-6">
              {courses
                .filter(course => course.isapproved)
                .map(course => (
                  <div key={course._id}>
                    <CourseCard
                      course={course}
                      showVideos={selectedCourse === course._id}
                      onVideoClick={() => handleCourseClick(course)}
                      showEnrollments={true}
                      isTeacher={true}
                    />
                    
                    {selectedCourse === course._id && (
                      <div className="mt-4 p-4 border-t border-gray-200 dark:border-gray-700">
                        <CourseVideos courseId={course._id} />
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {showPopup && (
        <Popup onClose={() => setShowPopup(false)} subject={subject} />
      )}
      {showVideoUpload && selectedCourse && (
        <VideoUpload
          courseId={selectedCourse}
          onClose={() => {
            setShowVideoUpload(false);
            const current = selectedCourse;
            setSelectedCourse(null);
            setTimeout(() => setSelectedCourse(current), 100);
          }}
        />
      )}
    </div>
  );
}

export default TeacherCourses;