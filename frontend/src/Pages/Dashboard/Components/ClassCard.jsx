import React from 'react';
import { FaVideo, FaClock, FaCheckCircle, FaHourglassHalf } from 'react-icons/fa';
import { getStatusColor } from '../../../utils/statusUtils';
import { formatTime } from '../../../utils/timeUtils';

const getStatusIcon = (status) => {
  switch (status.toLowerCase()) {
    case 'upcoming':
      return <FaHourglassHalf className="h-4 w-4" />;
    case 'completed':
      return <FaCheckCircle className="h-4 w-4" />;
    default:
      return null;
  }
};

const ClassCard = ({ classData, showStatus = true }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-[#042439] rounded-lg hover:bg-gray-100 dark:hover:bg-[#031c2e] transition-colors">
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0 p-2 bg-[#4E84C1]/10 rounded-lg">
          <FaVideo className="h-6 w-6 text-[#4E84C1]" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">
            {classData.coursename.toUpperCase()}
          </h3>
          <p className="text-sm text-[#4E84C1] mt-1">
            {classData.title}
          </p>
          <div className="flex items-center space-x-2 mt-2 text-sm text-gray-500 dark:text-gray-400">
            <FaClock className="h-4 w-4" />
            <span>{classData.date?.slice(0, 10)} at {formatTime(classData.timing)}</span>
          </div>
        </div>
      </div>
      {showStatus && classData.status && (
        <div className={`px-4 py-2 rounded-full flex items-center space-x-2 ${getStatusColor(classData.status)}`}>
          {getStatusIcon(classData.status)}
          <span className="text-sm font-medium capitalize">
            {classData.status}
          </span>
        </div>
      )}
    </div>
  );
};

export default ClassCard;