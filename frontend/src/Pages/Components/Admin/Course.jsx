import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";
import logo from '../../Images/logo.svg';

const Course = () => {
  const [courseData, setCourseData] = useState([]);
  const [error, setError] = useState("");
  const { data } = useParams();
  const navigator = useNavigate();

  useEffect(() => {
    const fetchCourseRequests = async () => {
      try {
        const response = await axios.get(`/api/admin/${data}/approve/course`);
        setCourseData(response.data.data);
      } catch (error) {
        console.error('Error fetching course requests:', error);
        setError('Failed to fetch course requests.');
      }
    };

    fetchCourseRequests();
  }, [data]);

  const handleCourseAction = async (id, isApproved) => {
    try {
      const response = await axios.post(`/api/admin/${data}/approve/course/${id}`, {
        Isapproved: isApproved,
      }, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        setCourseData(courseData.filter(course => course._id !== id));
        alert(response.data.message);
      }
    } catch (error) {
      console.error(`Error ${isApproved ? 'approving' : 'rejecting'} course request:`, error);
      setError(`Failed to ${isApproved ? 'approve' : 'reject'} the course request.`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#042439] via-[#0a3553] to-[#042439]">
      {/* Navbar */}
      <nav className="bg-white/10 backdrop-blur-md p-4 flex justify-between items-center">
        <div className="flex items-center gap-3 hover:opacity-90 transition-opacity">
          <img src={logo} className="w-12" alt="Edify Logo" />
          <h1 className="text-2xl text-white font-bold">Edify</h1>
        </div>

        <button 
          onClick={() => navigator('/')} 
          className="bg-[#4E84C1] text-white px-6 py-2 rounded-lg hover:bg-[#3a6da3] transition-all duration-200 font-semibold"
        >
          Logout
        </button>
      </nav>

      {/* Main Content */}
      <div className="p-6 md:p-8 lg:p-10">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white border-b-2 border-[#4E84C1] pb-2 inline-block">
            Course Requests
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courseData.map((course) => (
            <div 
              key={course._id} 
              className="bg-white/10 backdrop-blur-md rounded-xl p-6 hover:bg-white/15 transition-all duration-200"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-1">
                      {course.Course}
                    </h3>
                    <p className="text-[#4E84C1]">
                      {course.teacher.Firstname} {course.teacher.Lastname}
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm">
                    Pending
                  </span>
                </div>

                <div className="text-gray-300 space-y-2">
                  <p><span className="text-white font-medium">Duration:</span> {course.Duration}</p>
                  <p><span className="text-white font-medium">Price:</span> ₹{course.Price}</p>
                  <p><span className="text-white font-medium">Description:</span> {course.Description}</p>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    onClick={() => handleCourseAction(course._id, true)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleCourseAction(course._id, false)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-500/20 text-red-400 rounded-lg">
            {error}
          </div>
        )}

        {courseData.length === 0 && !error && (
          <div className="text-center text-gray-400 mt-8">
            No pending course requests available.
          </div>
        )}
      </div>
    </div>
  );
};

export default Course;

