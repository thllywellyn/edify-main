import React from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

const DashboardTabs = ({ userType }) => {
  const { ID } = useParams();
  const { user } = useAuth();

  // Define tabs based on user type
  const studentTabs = [
    { label: 'Documents', to: `/dashboard/student/${ID}/documents`, requiredForApproval: true },
    { label: 'Home', to: `/dashboard/student/${ID}/home`, requiresApproval: true },
    { label: 'Search', to: `/dashboard/student/${ID}/search`, requiresApproval: true },
    { label: 'My Courses', to: `/dashboard/student/${ID}/courses`, requiresApproval: true },
  ];

  const teacherTabs = [
    { label: 'Documents', to: `/dashboard/teacher/${ID}/documents`, requiredForApproval: true },
    { label: 'Home', to: `/dashboard/teacher/${ID}/home`, requiresApproval: true },
    { label: 'Courses', to: `/dashboard/teacher/${ID}/courses`, requiresApproval: true },
    { label: 'Classes', to: `/dashboard/teacher/${ID}/classes`, requiresApproval: true },
  ];

  const tabs = userType.toLowerCase() === 'student' ? studentTabs : teacherTabs;
  const isApproved = user?.Isapproved === 'approved';

  // Filter tabs based on approval status
  const visibleTabs = isApproved 
    ? tabs.filter(tab => !tab.requiredForApproval)  // Show only non-document tabs when approved
    : tabs.filter(tab => tab.requiredForApproval);  // Show only document tab when not approved

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
