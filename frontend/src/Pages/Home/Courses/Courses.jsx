import React, { useState, useEffect } from 'react'
import '../Landing/Landing.css'
import Footer from '../../Footer/Footer'
import Header from '../Header/Header'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'
import CourseVideos from '../../Dashboard/Components/CourseVideos'
import PaymentModal from '../../Components/PaymentModal'

function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSchedule, setShowSchedule] = useState(false);
  const [activeSchedule, setActiveSchedule] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPaymentCourse, setSelectedPaymentCourse] = useState(null);
  const navigate = useNavigate();
  const auth = useAuth();

  const daysName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const fetchCourses = async (subject = 'all') => {
    setLoading(true);
    try {
      let endpoint;
      if (auth.user?.type === 'teacher') {
        endpoint = `/api/course/teacher/${auth.user._id}/enrolled`;
      } else {
        endpoint = subject === 'all' ? '/api/course/all' : `/api/course/${subject}`;
      }
      
      const response = await fetch(endpoint, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        }
      });
      const data = await response.json();
      setCourses(data.data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCourses(selectedSubject);
  }, [selectedSubject, auth.user]);

  const handleSubjectFilter = (subject) => {
    setSelectedSubject(subject);
    fetchCourses(subject);
  };

  const handleEnroll = async (course) => {
    if (!auth.user) {
      navigate('/login');
      return;
    }

    if (auth.user.type === 'teacher') {
      return;
    }

    try {
      const verifyResponse = await fetch(
        `/api/course/${course.coursename}/${course._id}/verify/student/${auth.user._id}`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      if (!verifyResponse.ok) {
        const error = await verifyResponse.json();
        throw new Error(error.message || 'Cannot enroll in this course');
      }

      setSelectedPaymentCourse(course);
      setShowPaymentModal(true);

    } catch (error) {
      console.error('Error in enrollment process:', error);
      alert(error.message || 'Failed to process enrollment');
    }
  };

  const handlePaymentSuccess = async (paymentDetails) => {
    try {
      const enrollResponse = await fetch(
        `/api/course/${selectedPaymentCourse.coursename}/${selectedPaymentCourse._id}/add/student/${auth.user._id}`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      if (!enrollResponse.ok) {
        const enrollError = await enrollResponse.json();
        throw new Error(enrollError.message || 'Failed to complete enrollment');
      }

      alert('Successfully enrolled in the course!');
      fetchCourses(selectedSubject);
    } catch (error) {
      console.error('Enrollment error:', error);
      alert(error.message || 'Failed to complete enrollment');
    }
  };

  const handleScheduleClick = (schedule) => {
    setActiveSchedule(schedule);
    setShowSchedule(true);
  };

  const isEnrolled = (course) => {
    return course.enrolledStudent?.some(studentId => studentId === auth.user?._id);
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#042439] pb-8">
        <div className="w-full bg-[#0E3A59] py-12 mb-8">
          <div className="w-full max-w-[2000px] mx-auto px-4">
            <h1 className="text-4xl font-bold text-white mb-4">
              {auth.user?.type === 'teacher' ? 'Your Courses' : 'Available Courses'}
            </h1>
            <p className="text-gray-300">
              {auth.user?.type === 'teacher' 
                ? 'Manage and view your created courses'
                : 'Explore our wide range of courses taught by expert instructors'}
            </p>
          </div>
        </div>

        <div className="w-full max-w-[2000px] mx-auto px-4">
          {auth.user?.type !== 'teacher' && (
            <div className="flex flex-wrap gap-3 mb-8">
              {['all', 'physics', 'chemistry', 'biology', 'math', 'computer'].map(subject => (
                <button
                  key={subject}
                  onClick={() => handleSubjectFilter(subject)}
                  className={`px-8 py-3 rounded-lg transition-all text-base whitespace-nowrap flex items-center justify-center min-w-[120px] ${
                    selectedSubject === subject
                      ? 'bg-[#9433E0] text-white shadow-lg'
                      : 'bg-[#0E3A59] text-gray-300 hover:bg-[#164668]'
                  }`}
                >
                  {subject.charAt(0).toUpperCase() + subject.slice(1)}
                </button>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {loading ? (
              <div className="text-white text-center col-span-full text-xl py-12">
                Loading courses...
              </div>
            ) : courses.length === 0 ? (
              <div className="text-white text-center col-span-full text-xl py-12">
                {auth.user?.type === 'teacher' 
                  ? "You haven't created any courses yet"
                  : "No courses found"}
              </div>
            ) : (
              courses.map((course) => (
                <div key={course._id} className="bg-[#0E3A59] rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow flex flex-col border border-[#9433E0]/20">
                  <div className="bg-[#042439] p-4">
                    <h2 className="text-xl font-bold text-white mb-2">
                      {course.coursename.toUpperCase()}
                    </h2>
                    <div className="flex items-center gap-2">
                      <img 
                        src="https://www.pngall.com/wp-content/uploads/5/Profile-Male-PNG.png" 
                        alt="teacher" 
                        className="w-8 h-8 rounded-full border-2 border-[#9433E0]"
                      />
                      <p className="text-gray-300 font-medium">
                        {course.enrolledteacher?.Firstname} {course.enrolledteacher?.Lastname}
                      </p>
                    </div>
                  </div>
                  
                  <div className="p-4 flex-1 flex flex-col">
                    <p className="text-gray-300 mb-4 flex-1 min-h-[60px]">
                      {course.description || "Learn the fundamentals and advanced concepts with our expert instructor."}
                    </p>
                    
                    <div className="space-y-4 mt-auto">
                      <span className="block bg-[#042439] text-gray-300 px-3 py-2 rounded-full text-sm text-center">
                        {course.enrolledStudent?.length || 0}/20 Students
                      </span>
                      
                      <button
                        onClick={() => setSelectedCourse(selectedCourse === course._id ? null : course._id)}
                        className="w-full bg-[#042439] text-gray-300 px-4 py-3 rounded-md hover:bg-[#0a3352] transition-colors text-sm flex items-center justify-center h-11"
                      >
                        {selectedCourse === course._id ? 'Hide Videos' : 'View Course Videos'}
                      </button>

                      {selectedCourse === course._id && (
                        <div className="border-t border-[#9433E0]/20 pt-4">
                          <CourseVideos 
                            courseId={course._id} 
                            studentId={auth.user?._id}
                          />
                        </div>
                      )}
                      
                      {auth.user?.type !== 'teacher' && (
                        <button
                          onClick={() => !isEnrolled(course) && handleEnroll(course)}
                          className={`w-full ${
                            isEnrolled(course) 
                              ? 'bg-green-600 cursor-not-allowed' 
                              : 'bg-[#9433E0] hover:bg-[#7928b8]'
                          } text-white px-4 py-3 rounded-md transition-colors text-sm font-medium flex items-center justify-center h-11`}
                          disabled={isEnrolled(course)}
                        >
                          {isEnrolled(course) ? 'Enrolled' : 'Enroll Now'}
                        </button>
                      )}
                      
                      <button
                        onClick={() => handleScheduleClick(course.schedule)}
                        className="w-full bg-[#042439] text-gray-300 px-4 py-3 rounded-md hover:bg-[#0a3352] transition-colors text-sm flex items-center justify-center h-11"
                      >
                        View Schedule
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {showSchedule && activeSchedule && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[#0E3A59] rounded-lg p-6 w-[800px] max-w-[90%] border border-[#9433E0]/20">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">Weekly Schedule</h3>
                <button 
                  onClick={() => setShowSchedule(false)}
                  className="text-gray-300 hover:text-white"
                >
                  ✕
                </button>
              </div>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[#042439]">
                    <th className="border border-[#9433E0]/20 p-2 text-white">Day</th>
                    <th className="border border-[#9433E0]/20 p-2 text-white">Start Time</th>
                    <th className="border border-[#9433E0]/20 p-2 text-white">End Time</th>
                  </tr>
                </thead>
                <tbody>
                  {activeSchedule.map((slot, index) => (
                    <tr key={index} className="text-gray-300">
                      <td className="border border-[#9433E0]/20 p-2">{daysName[slot.day]}</td>
                      <td className="border border-[#9433E0]/20 p-2">
                        {`${Math.floor(slot.starttime / 60)}:${slot.starttime % 60 === 0 ? "00" : slot.starttime % 60}`}
                      </td>
                      <td className="border border-[#9433E0]/20 p-2">
                        {`${Math.floor(slot.endtime / 60)}:${slot.endtime % 60 === 0 ? "00" : slot.endtime % 60}`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {showPaymentModal && selectedPaymentCourse && (
          <PaymentModal
            onClose={() => {
              setShowPaymentModal(false);
              setSelectedPaymentCourse(null);
            }}
            amount={selectedPaymentCourse.price * 100}
            courseName={selectedPaymentCourse.coursename.toUpperCase()}
            onPaymentSuccess={handlePaymentSuccess}
          />
        )}
      </div>
      <Footer />
    </>
  );
}

export default Courses;