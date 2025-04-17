import React, { useState, useEffect } from 'react';
import { NavLink, useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../../../context/ThemeContext';
import { FaSun, FaMoon, FaHome, FaBook, FaCalendarAlt, FaUserGraduate } from 'react-icons/fa';
import { RiMenu4Fill } from 'react-icons/ri';
import logo from '../../Images/logo.svg';

function CommonDashboard({ userType }) {
  const { ID } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const { isDarkMode, toggleTheme } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const response = await fetch(`/api/${userType.toLowerCase()}/logout`, {
        method: 'POST',
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        }
      });
      const data = await response.json();
      if (data.statusCode === 200) {
        navigate('/');
      }
    } catch (error) {
      setError('Failed to logout');
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`/api/${userType}/${userType}Document/${ID}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        setUserData(data.data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchUserData();
  }, [ID, userType]);

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#042439]">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 bg-white dark:bg-[#0a3553] shadow-lg z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Brand */}
            <div className="flex items-center">
              <NavLink to="/" className="flex items-center space-x-3">
                <img src={logo} alt="Edify Logo" className="h-10 w-auto" />
                <span className="text-xl font-bold text-[#4E84C1] dark:text-white hidden md:block">
                  Edify
                </span>
              </NavLink>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="md:hidden p-2 rounded-md text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-[#042439] transition-colors"
            >
              <RiMenu4Fill className="h-6 w-6" />
            </button>

            {/* Navigation Links */}
            <div className={`${isSidebarOpen ? 'block' : 'hidden'} md:flex absolute md:relative top-16 md:top-0 left-0 right-0 md:items-center bg-white dark:bg-[#0a3553] md:bg-transparent shadow-lg md:shadow-none`}>
              <div className="px-2 pt-2 pb-3 space-y-1 md:space-y-0 md:space-x-3 md:flex">
                <NavLink 
                  to="/"
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-[#4E84C1] dark:text-white hover:bg-gray-100 dark:hover:bg-[#042439] transition-colors"
                >
                  <FaHome className="h-4 w-4 mr-2" />
                  Home
                </NavLink>

                {/* Role-specific navigation links */}
                {userType === 'Student' ? (
                  <>
                    <NavLink 
                      to={`/dashboard/student/${ID}/search`}
                      className={({isActive}) => 
                        `flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                          isActive 
                            ? "bg-[#4E84C1] text-white" 
                            : "text-[#4E84C1] dark:text-white hover:bg-gray-100 dark:hover:bg-[#042439]"
                        } transition-colors`
                      }
                    >
                      <FaUserGraduate className="h-4 w-4 mr-2" />
                      Teachers
                    </NavLink>
                  </>
                ) : (
                  <>
                    <NavLink 
                      to={`/dashboard/teacher/${ID}/home`}
                      className={({isActive}) => 
                        `flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                          isActive 
                            ? "bg-[#4E84C1] text-white" 
                            : "text-[#4E84C1] dark:text-white hover:bg-gray-100 dark:hover:bg-[#042439]"
                        } transition-colors`
                      }
                    >
                      <FaHome className="h-4 w-4 mr-2" />
                      Dashboard
                    </NavLink>
                  </>
                )}

                {/* Common navigation links */}
                <NavLink 
                  to={`/dashboard/${userType.toLowerCase()}/${ID}/classes`}
                  className={({isActive}) => 
                    `flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                      isActive 
                        ? "bg-[#4E84C1] text-white" 
                        : "text-[#4E84C1] dark:text-white hover:bg-gray-100 dark:hover:bg-[#042439]"
                    } transition-colors`
                  }
                >
                  <FaCalendarAlt className="h-4 w-4 mr-2" />
                  Classes
                </NavLink>

                <NavLink 
                  to={`/dashboard/${userType.toLowerCase()}/${ID}/courses`}
                  className={({isActive}) => 
                    `flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                      isActive 
                        ? "bg-[#4E84C1] text-white" 
                        : "text-[#4E84C1] dark:text-white hover:bg-gray-100 dark:hover:bg-[#042439]"
                    } transition-colors`
                  }
                >
                  <FaBook className="h-4 w-4 mr-2" />
                  Courses
                </NavLink>
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-[#042439] transition-colors"
                aria-label="Toggle theme"
              >
                {isDarkMode ? <FaSun className="h-5 w-5" /> : <FaMoon className="h-5 w-5" />}
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-md bg-[#4E84C1] text-white text-sm font-medium hover:bg-[#3a6da3] transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Profile Section */}
          {userData && (
            <div className="bg-white dark:bg-[#0a3553] rounded-lg shadow-md p-6 mb-6">
              <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
                <div className="flex-shrink-0">
                  <img 
                    src="https://www.pngall.com/wp-content/uploads/5/Profile-Male-PNG.png"
                    alt="Profile"
                    className="h-24 w-24 rounded-full border-4 border-[#4E84C1]"
                  />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {userData.Firstname} {userData.Lastname}
                  </h1>
                  <p className="text-[#4E84C1] text-lg">{userType}</p>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">
                    {userData.Email}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default CommonDashboard;