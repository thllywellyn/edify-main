import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Popup from './Popup';
import VideoUpload from './VideoUpload';
import CourseVideos from '../Components/CourseVideos';

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

  const createCourse = (sub) => {
    setShowPopup(true);
    setSubject(sub);
  };

  const handleCourseClick = (course) => {
    setSelectedCourse(course._id === selectedCourse ? null : course._id);
  };

  return (
    <div className="mx-8 mt-8 ml-60">
      <div className="flex flex-wrap gap-10 mb-8">
        {['Physics', 'Chemistry', 'Biology', 'Math', 'Computer'].map((sub) => (
          <div
            key={sub}
            className="subject cursor-pointer bg-[#042439] rounded-lg p-4 text-center hover:bg-[#0E3A59] transition-colors"
            onClick={() => createCourse(sub)}
          >
            <img
              src={`https://www.figma.com/file/6b4R8evBkii6mI53IA4vSS/image/${
                sub === 'Physics' ? '8e9bf690d23d886f63466a814cfbec78187f91d2' :
                sub === 'Chemistry' ? '3e546b344774eb0235acc6bf6dad7814a59d6e95' :
                sub === 'Biology' ? '28ac70002ae0a676d9cfb0f298f3e453d12b5555' :
                sub === 'Math' ? '61930117e428a1f0f7268f888a84145f93aa0664' :
                'a64c93efe984ab29f1dfb9e8d8accd9ba449f272'
              }`}
              alt={sub}
              className="w-16 h-16 mx-auto mb-2"
            />
            <p className="text-white">{sub}</p>
          </div>
        ))}
      </div>

      {/* Approved Courses Section */}
      {courses.filter(course => course.isapproved).length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-white mb-4">Your Approved Courses</h2>
          <div className="space-y-4">
            {courses.filter(course => course.isapproved).map(course => (
              <div key={course._id} className="bg-[#042439] rounded-lg p-4">
                <div 
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => handleCourseClick(course)}
                >
                  <div>
                    <h3 className="text-xl text-white font-semibold">{course.coursename.toUpperCase()}</h3>
                    <p className="text-gray-400">{course.description}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCourse(course._id);
                      setShowVideoUpload(true);
                    }}
                    className="bg-[#9433E0] hover:bg-[#7928b8] text-white px-4 py-2 rounded-md"
                  >
                    Upload Video
                  </button>
                </div>

                {selectedCourse === course._id && (
                  <div className="mt-4 border-t border-[#9433E0]/20 pt-4">
                    <CourseVideos courseId={course._id} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {showPopup && (
        <Popup onClose={() => setShowPopup(false)} subject={subject} />
      )}

      {showVideoUpload && selectedCourse && (
        <VideoUpload
          courseId={selectedCourse}
          onClose={() => {
            setShowVideoUpload(false);
            // Refresh the course videos by toggling selectedCourse
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