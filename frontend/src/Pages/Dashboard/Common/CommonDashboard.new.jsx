import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useParams, useNavigate, Outlet } from 'react-router-dom';
import { useTheme } from '../../../context/ThemeContext';
import { useAuth } from '../../../context/AuthContext';
import { FaSun, FaMoon, FaHome, FaBook, FaCalendarAlt, FaUserGraduate, FaUserCircle, FaBell, FaFileAlt } from 'react-icons/fa';
import { RiMenu4Fill, RiCloseLine } from 'react-icons/ri';
import logo from '../../Images/logo.svg';
import NotificationDropdown from '../Components/NotificationDropdown';
import DashboardTabs from '../Components/DashboardTabs';

function CommonDashboard({ userType }) {
  const { ID } = useParams();
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { logout, user } = useAuth();
  const sidebarRef = useRef(null);
  const buttonRef = useRef(null);

  const handleLogout = () => {
    try {
      logout();
    } catch (error) {
      console.error('Failed to logout');
    }
  };

  // Handle clicks outside sidebar to close it on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current && 
        !sidebarRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const needsDocuments = !user?.Studentdetails || ['pending', 'rejected', 'reupload'].includes(user?.Isapproved);

  // Custom function to determine which nav items to show
  const getNavItems = () => {
    const items = [];

    // Always show Home
    items.push({
      to: "/",
      icon: <FaHome className="h-4 w-4 mr-3" />,
      label: "Home",
      showWhen: "always"
    });

    // Role specific items
    if (userType === 'Student') {
      items.push({
        to: `/dashboard/student/${ID}/search`,
        icon: <FaUserGraduate className="h-4 w-4 mr-3" />,
        label: "Find Teachers",
        showWhen: "approved"
      });
    } else {
      items.push({
        to: `/dashboard/teacher/${ID}/home`,
        icon: <FaHome className="h-4 w-4 mr-3" />,
        label: "Dashboard",
        showWhen: "approved"
      });
    }

    // Common items for approved users
    if (user?.Isapproved === 'approved') {
      items.push(
        {
          to: `/dashboard/${userType.toLowerCase()}/${ID}/classes`,
          icon: <FaCalendarAlt className="h-4 w-4 mr-3" />,
          label: "Classes",
          showWhen: "approved"
        },
        {
          to: `/dashboard/${userType.toLowerCase()}/${ID}/courses`,
          icon: <FaBook className="h-4 w-4 mr-3" />,
          label: "Courses",
          showWhen: "approved"
        }
      );
    }

    // Show Documents link when not approved or needs documents
    if (needsDocuments) {
      items.push({
        to: `/dashboard/${userType.toLowerCase()}/${ID}/documents`,
        icon: <FaFileAlt className="h-4 w-4 mr-3" />,
        label: "Documents",
        showWhen: "not-approved"
      });
    }

    return items;
  };

  const navItems = getNavItems();

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#031c2e]">
      {/* Sidebar */}
      <aside ref={sidebarRef} className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-[#0a3553] shadow-lg transform md:translate-x-0 transition-transform duration-300 ease-in-out`}>
        <div className="h-full flex flex-col">
          {/* Close button for mobile */}
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#042439] transition-colors text-gray-500 dark:text-gray-400"
          >
            <RiCloseLine className="h-6 w-6" />
          </button>

          {/* Logo */}
          <div className="p-6 flex items-center space-x-4 border-b border-gray-200 dark:border-gray-700">
            <img src={logo} alt="Edify Logo" className="h-8 w-auto" />
            <span className="text-xl font-bold text-[#4E84C1] dark:text-white">
              Edify
            </span>
          </div>

          {/* User Profile Preview */}
          {user && (
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <FaUserCircle className="h-12 w-12 text-[#4E84C1] dark:text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-base font-semibold text-gray-900 dark:text-white truncate">
                    {user.Firstname} {user.Lastname}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {user.Email}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="flex-1 px-4 pt-4 space-y-2 overflow-y-auto">
            {navItems.map((item) => (
              <NavLink 
                key={item.to}
                to={item.to}
                className={({isActive}) => 
                  `flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                    isActive 
                      ? "bg-[#4E84C1] text-white" 
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#042439]"
                  } transition-colors`
                }
              >
                {item.icon}
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Bottom Actions */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={toggleTheme}
              className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#042439] rounded-md transition-colors"
            >
              {isDarkMode ? (
                <>
                  <FaSun className="h-4 w-4 mr-3" />
                  Light Mode
                </>
              ) : (
                <>
                  <FaMoon className="h-4 w-4 mr-3" />
                  Dark Mode
                </>
              )}
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-3 py-2 mt-2 text-sm font-medium text-white bg-[#4E84C1] hover:bg-[#3a6da3] rounded-md transition-colors"
            >
              <span className="mr-3">→</span>
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="md:ml-64 min-h-screen">
        {/* Header */}
        <header className="fixed top-0 right-0 left-0 md:left-64 bg-white dark:bg-[#0a3553] shadow-sm z-40">
          <div className="flex items-center justify-between px-4 h-16">
            <button
              ref={buttonRef}
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="md:hidden p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#042439] transition-colors"
            >
              {isSidebarOpen ? (
                <RiCloseLine className="h-6 w-6" />
              ) : (
                <RiMenu4Fill className="h-6 w-6" />
              )}
            </button>

            <div className="flex items-center space-x-4 ml-auto">
              {user?.Isapproved === 'approved' && <NotificationDropdown />}
              {user && (
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {userType} Dashboard
                  </span>
                  <FaUserCircle className="h-8 w-8 text-[#4E84C1] dark:text-white" />
                </div>
              )}
            </div>
          </div>
          {/* Tabs */}
          <div className="px-4 py-2">
            <DashboardTabs userType={userType} />
          </div>
        </header>

        {/* Page Content */}
        <main className="pt-28 p-4">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default CommonDashboard;
