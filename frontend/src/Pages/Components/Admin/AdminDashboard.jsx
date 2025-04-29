import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useParams, useNavigate, Outlet } from 'react-router-dom';
import { useTheme } from '../../../context/ThemeContext';
import { useAuth } from '../../../context/AuthContext';
import { FaSun, FaMoon, FaHome, FaBell, FaUserGraduate, FaBook, FaUserCircle } from 'react-icons/fa';
import { RiMenu4Fill, RiCloseLine } from 'react-icons/ri';
import { IoIosNotificationsOutline } from "react-icons/io";
import logo from '../../Images/logo.svg';

function AdminDashboard() {
  const { data } = useParams();
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState(null);
  const [error, setError] = useState("");
  const { isDarkMode, toggleTheme } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { logout } = useAuth();
  const [allmsg, setAllMsg] = useState([]);
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const sidebarRef = useRef(null);
  const buttonRef = useRef(null);

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

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch('/api/admin/messages/all', {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": window.csrfToken
          },
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Failed to fetch messages');
        }

        const result = await response.json();
        setAllMsg(result.data || []);
      } catch (err) {
        console.error('Error fetching messages:', err);
      }
    };
    fetchMessages();
  }, []);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await fetch(`/api/admin/${data}/approve`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": window.csrfToken
          },
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error("Failed to fetch admin data");
        }

        const result = await response.json();
        setAdminData(result.data.admin);
        setError("");
      } catch (err) {
        setError("Failed to load admin data");
        console.error("Error fetching data:", err);
      }
    };
    fetchAdminData();
  }, [data]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      setError('Failed to logout');
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#042439] via-[#0a3553] to-[#042439] flex items-center justify-center">
        <div className="bg-red-500/10 backdrop-blur-md p-6 rounded-lg border border-red-500">
          <p className="text-red-500 text-center mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#042439] flex">
      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-[#0a3553] transform transition-transform duration-200 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 border-r border-gray-200 dark:border-gray-700`}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-6 flex items-center space-x-4 border-b border-gray-200 dark:border-gray-700">
            <img src={logo} alt="Edify Logo" className="h-8 w-auto" />
            <span className="text-xl font-bold text-[#4E84C1] dark:text-white">
              Edify
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-4 pt-4 space-y-2 overflow-y-auto">
            <NavLink
              to={`/admin/${data}`}
              end
              className={({isActive}) =>
                `flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  isActive
                    ? "bg-[#4E84C1] text-white"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#042439]"
                } transition-colors`
              }
            >
              <FaHome className="h-4 w-4 mr-3" />
              Approvals
            </NavLink>

            <NavLink
              to={`/admin/${data}/courses`}
              className={({isActive}) =>
                `flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  isActive
                    ? "bg-[#4E84C1] text-white"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#042439]"
                } transition-colors`
              }
            >
              <FaBook className="h-4 w-4 mr-3" />
              Course Requests
            </NavLink>

            <button
              onClick={() => setIsMessagesOpen(!isMessagesOpen)}
              className="flex items-center w-full px-3 py-2 rounded-md text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#042439] transition-colors"
            >
              <FaBell className="h-4 w-4 mr-3" />
              Messages
              {allmsg.length > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {allmsg.length}
                </span>
              )}
            </button>
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
      </div>

      {/* Main Content */}
      <div className="flex-1 md:ml-64">
        {/* Top Navigation */}
        <header className="fixed top-0 right-0 left-0 md:left-64 bg-white dark:bg-[#0a3553] border-b border-gray-200 dark:border-gray-700 z-40">
          <div className="h-16 px-4 flex items-center justify-between">
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

            {adminData && (
              <div className="flex items-center space-x-3 ml-auto">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Admin Dashboard
                </span>
                <FaUserCircle className="h-8 w-8 text-[#4E84C1] dark:text-white" />
              </div>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="pt-16 p-4">
          <div className="max-w-7xl mx-auto">
            <Outlet />
            
            {/* Messages Modal */}
            {isMessagesOpen && allmsg.length > 0 && (
              <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-start justify-center pt-20 px-4 z-50">
                <div className="bg-white dark:bg-[#0a3553] w-full max-w-2xl rounded-xl shadow-xl">
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Messages</h2>
                      <button
                        onClick={() => setIsMessagesOpen(false)}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      >
                        <RiCloseLine className="h-6 w-6" />
                      </button>
                    </div>
                    <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                      {allmsg.map((msg, index) => (
                        <div key={index} className="bg-gray-50 dark:bg-[#042439] p-4 rounded-lg">
                          <div className="grid grid-cols-[auto,1fr] gap-2">
                            <span className="font-semibold text-gray-700 dark:text-gray-300">Name:</span>
                            <span className="text-gray-900 dark:text-white">{msg.name}</span>

                            <span className="font-semibold text-gray-700 dark:text-gray-300">Email:</span>
                            <span className="text-[#4E84C1]">{msg.email}</span>

                            <span className="font-semibold text-gray-700 dark:text-gray-300">Message:</span>
                            <span className="text-gray-900 dark:text-white">{msg.message}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;