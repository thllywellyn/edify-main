import React from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

const DashboardTabs = ({ userType }) => {
  const { ID } = useParams();
  const { user } = useAuth();

  // Define tabs based on user type and approval status
  const studentTabs = [
    { label: 'Documents', to: `/dashboard/student/${ID}/documents`, visibleWhen: ['pending', 'rejected', 'reupload', 'none'] },
    { label: 'Home', to: `/dashboard/student/${ID}/home`, visibleWhen: ['approved'] },
    { label: 'Search', to: `/dashboard/student/${ID}/search`, visibleWhen: ['approved'] },
    { label: 'My Courses', to: `/dashboard/student/${ID}/courses`, visibleWhen: ['approved'] },
  ];

  const teacherTabs = [
    { label: 'Documents', to: `/dashboard/teacher/${ID}/documents`, visibleWhen: ['pending', 'rejected', 'reupload', 'none'] },
    { label: 'Home', to: `/dashboard/teacher/${ID}/home`, visibleWhen: ['approved'] },
    { label: 'Courses', to: `/dashboard/teacher/${ID}/courses`, visibleWhen: ['approved'] },
    { label: 'Classes', to: `/dashboard/teacher/${ID}/classes`, visibleWhen: ['approved'] },
  ];

  const tabs = userType.toLowerCase() === 'student' ? studentTabs : teacherTabs;
  const approvalStatus = user?.Isapproved || 'none';

  // Show tabs based on user's current approval status
  const visibleTabs = tabs.filter(tab => tab.visibleWhen.includes(approvalStatus));

  return (
    <nav className="bg-white/5 backdrop-blur-md p-1 rounded-lg flex space-x-1">
      {visibleTabs.map((tab) => (
        <NavLink
          key={tab.label}
          to={tab.to}
          className={({ isActive }) =>
            `px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              isActive
                ? 'bg-[#4E84C1] text-white'
                : 'text-gray-400 hover:text-white hover:bg-[#4E84C1]/10'
            }`
          }
        >
          {tab.label}
        </NavLink>
      ))}
    </nav>
  );
};

export default DashboardTabs;
