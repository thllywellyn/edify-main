import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const AdminCourses = () => {
  const [pendingCourses, setPendingCourses] = useState([]);
  const [approvedCourses, setApprovedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { data } = useParams();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(`/api/admin/${data}/approve/course`, {
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": window.csrfToken
          },
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Failed to fetch course requests');
        }

        const result = await response.json();
        // Separate courses into pending and approved
        const pending = result.data.filter(course => !course.isapproved);
        const approved = result.data.filter(course => course.isapproved);
        
        setPendingCourses(pending);
        setApprovedCourses(approved);
      } catch (err) {
        setError('Failed to load course requests. Please try again later.');
        console.error('Error fetching courses:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [data]);

  const handleApproval = async (courseId, isApproved, teacherEmail, teacherName, courseName) => {
    try {
      const response = await fetch(`/api/admin/${data}/approve/course/${courseId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": window.csrfToken
        },
        credentials: 'include',
        body: JSON.stringify({
          Isapproved: isApproved,
          email: teacherEmail,
          Firstname: teacherName,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update course status");
      }

      // Move the course to the appropriate list or remove it if rejected
      if (isApproved) {
        const courseToMove = pendingCourses.find(course => course._id === courseId);
        if (courseToMove) {
          setPendingCourses(prev => prev.filter(course => course._id !== courseId));
          setApprovedCourses(prev => [...prev, { ...courseToMove, isapproved: true }]);
        }
      } else {
        setPendingCourses(prev => prev.filter(course => course._id !== courseId));
      }
    } catch (err) {
      setError("Failed to update course status. Please try again.");
      console.error("Error updating course:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4E84C1]"></div>
          <p className="text-gray-500 dark:text-gray-400">Loading course requests...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg">
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-2 text-sm font-medium hover:text-red-700 dark:hover:text-red-300"
        >
          Try Again →
        </button>
      </div>
    );
  }

  const renderCourseCard = (course, isPending = true) => (
    <div
      key={course._id}
      className="bg-gray-50 dark:bg-[#042439] p-6 rounded-lg space-y-4"
    >
      <div className="flex flex-wrap justify-between gap-4">
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {course.coursename.toUpperCase()}
          </h3>
          <p className="text-sm text-[#4E84C1]">
            By {course.enrolledteacher.Firstname} {course.enrolledteacher.Lastname}
          </p>
        </div>
        {isPending && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => 
                handleApproval(
                  course._id, 
                  true,
                  course.enrolledteacher.Email,
                  course.enrolledteacher.Firstname,
                  course.coursename
                )
              }
              className="px-4 py-2 text-sm font-medium text-white bg-green-500 hover:bg-green-600 rounded-md transition-colors"
            >
              Approve
            </button>
            <button
              onClick={() => 
                handleApproval(
                  course._id, 
                  false,
                  course.enrolledteacher.Email,
                  course.enrolledteacher.Firstname,
                  course.coursename
                )
              }
              className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-md transition-colors"
            >
              Reject
            </button>
          </div>
        )}
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
        <div className="grid gap-2">
          <p className="text-gray-600 dark:text-gray-300">
            <span className="font-medium text-gray-900 dark:text-white">Price:</span> ₹{course.price || 'N/A'}
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            <span className="font-medium text-gray-900 dark:text-white">Description:</span> {course.description}
          </p>
          {course.schedule && (
            <div>
              <span className="font-medium text-gray-900 dark:text-white">Schedule:</span>
              <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                {course.schedule.map((slot, index) => (
                  <div key={index} className="text-sm text-gray-600 dark:text-gray-300">
                    {slot.day}: {slot.starttime}:00 - {slot.endtime}:00
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Pending Courses Section */}
      <div className="bg-white dark:bg-[#0a3553] rounded-lg shadow-sm">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Pending Course Approvals
          </h2>

          {pendingCourses.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                No pending course approval requests at this time.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {pendingCourses.map(course => renderCourseCard(course, true))}
            </div>
          )}
        </div>
      </div>

      {/* Approved Courses Section */}
      <div className="bg-white dark:bg-[#0a3553] rounded-lg shadow-sm">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Recently Approved Courses
          </h2>

          {approvedCourses.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                No recently approved courses.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {approvedCourses.map(course => renderCourseCard(course, false))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminCourses;