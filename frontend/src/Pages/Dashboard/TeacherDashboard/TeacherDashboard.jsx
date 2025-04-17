import React, { useEffect, useState } from 'react'
import { NavLink, useParams, useNavigate } from 'react-router-dom'
import { useTheme } from '../../../context/ThemeContext'
import { FaSun, FaMoon, FaHome } from 'react-icons/fa'
import { RiMenu4Fill } from 'react-icons/ri'
import logo from '../../Images/logo.svg'

function TeacherDashboard() {
  const { ID } = useParams();
  const navigator = useNavigate();
  const [data, setdata] = useState([]);
  const { isDarkMode, toggleTheme } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const Handlelogout = async() => {
    const response = await fetch(`/api/teacher/logout`, {
      method: 'POST',
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      }
    });
    const data = await response.json();
    if(data.statusCode == 200){
      navigator('/');
    }
  }

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch(`/api/Teacher/TeacherDocument/${ID}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const user = await response.json();
        setdata(user.data);
      } catch (error) {
        console.error(error);
      }
    };
    getData();
  },[ID]);

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
                <NavLink 
                  to={`/Teacher/Dashboard/${ID}/Home`}
                  className={({isActive}) => 
                    `block px-3 py-2 rounded-md text-sm font-medium ${
                      isActive 
                        ? "bg-[#4E84C1] text-white" 
                        : "text-[#4E84C1] dark:text-white hover:bg-gray-100 dark:hover:bg-[#042439]"
                    } transition-colors`
                  }
                >
                  Dashboard
                </NavLink>
                <NavLink 
                  to={`/Teacher/Dashboard/${ID}/Classes`}
                  className={({isActive}) => 
                    `block px-3 py-2 rounded-md text-sm font-medium ${
                      isActive 
                        ? "bg-[#4E84C1] text-white" 
                        : "text-[#4E84C1] dark:text-white hover:bg-gray-100 dark:hover:bg-[#042439]"
                    } transition-colors`
                  }
                >
                  Classes
                </NavLink>
                <NavLink 
                  to={`/Teacher/Dashboard/${ID}/Courses`}
                  className={({isActive}) => 
                    `block px-3 py-2 rounded-md text-sm font-medium ${
                      isActive 
                        ? "bg-[#4E84C1] text-white" 
                        : "text-[#4E84C1] dark:text-white hover:bg-gray-100 dark:hover:bg-[#042439]"
                    } transition-colors`
                  }
                >
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
                onClick={Handlelogout}
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
                  {data.Firstname} {data.Lastname}
                </h1>
                <p className="text-[#4E84C1] text-lg">Teacher</p>
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                  {data.Email}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default TeacherDashboard