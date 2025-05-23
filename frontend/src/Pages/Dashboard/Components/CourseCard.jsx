import React from 'react';
import { FaBook, FaPlay, FaUserGraduate, FaCalendarAlt, FaEdit } from 'react-icons/fa';
import { daysOfWeek } from '../../../utils/statusUtils';
import { formatTime } from '../../../utils/timeUtils';

const CourseCard = ({ 
  course, 
  showVideos, 
  onVideoClick, 
  onDetailsClick,
  showEnrollments = false,
  isTeacher = false,
  onEdit
}) => {
  return (
    <div className="bg-white dark:bg-[#0a3553] rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-[#4E84C1]/10 rounded-lg">
            <FaBook className="h-6 w-6 text-[#4E84C1]" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {(course?.coursename ? course.coursename.toUpperCase() : 'Course Name')}
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
              {course.description || 'No description available'}
            </p>
          </div>
        </div>

        {course.schedule && (
          <div className="mt-4">
            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <FaCalendarAlt className="h-4 w-4 text-[#4E84C1]" />
              <span className="font-medium">Schedule:</span>
            </div>
            <div className="mt-2 text-sm text-gray-500 dark:text-gray-400 space-y-1.5">
              {course.schedule.map((timeSlot, index) => (
                <div key={index} className="flex justify-between items-center py-1 px-2 rounded-md bg-gray-50 dark:bg-[#042439]">
                  <span className="font-medium">{daysOfWeek[timeSlot.day]}</span>
                  <span>
                    {formatTime(timeSlot.starttime)} - {formatTime(timeSlot.endtime)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {showEnrollments && (
          <div className="mt-4 flex items-center space-x-2 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-[#042439] p-2 rounded-md">
            <FaUserGraduate className="h-5 w-5 text-[#4E84C1]" />
            <span>{course.enrolledStudents?.length || 0} Students Enrolled</span>
          </div>
        )}

        <div className="mt-6 flex items-center justify-between">
          {onDetailsClick && (
            <button
              onClick={() => onDetailsClick(course)}
              className="text-sm font-medium text-[#4E84C1] hover:text-[#3a6da3] transition-colors"
            >
              View Details
            </button>
          )}
          <div className="flex items-center gap-3">
            {isTeacher && onEdit && (
              <button
                onClick={() => onEdit(course)}
                className="flex items-center px-4 py-2 bg-gray-100 dark:bg-[#042439] hover:bg-gray-200 dark:hover:bg-[#031c2e] text-[#4E84C1] rounded-md transition-colors text-sm"
              >
                <FaEdit className="h-4 w-4 mr-2" />
                Edit
              </button>
            )}
            <button
              onClick={() => onVideoClick(course)}
              className="flex items-center px-4 py-2 bg-[#4E84C1] hover:bg-[#3a6da3] text-white rounded-md transition-colors text-sm"
            >
              <FaPlay className="h-4 w-4 mr-2" />
              {showVideos ? 'Hide Videos' : 'View Videos'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;