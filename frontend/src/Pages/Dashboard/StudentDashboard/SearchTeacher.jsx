import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { FaSearch, FaStar, FaGraduationCap, FaUserCircle, FaPlay } from 'react-icons/fa';
import { BsClockFill } from 'react-icons/bs';
import DashboardCard from '../Components/DashboardCard';

function SearchTeacher() {
    const navigate = useNavigate();
    const auth = useAuth();
    const [openTM, setOpenTM] = useState(false);
    const [teacherDetails, setTeacherDetails] = useState(null);
    const [showSchedule, setShowSchedule] = useState(false);
    const [activeSchedule, setActiveSchedule] = useState(null);
    const scheduleRef = useRef(null);
    const [course, setCourse] = useState([]);
    const [allCourses, setAllCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchResults, setSearchResults] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    const daysName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (scheduleRef.current && !scheduleRef.current.contains(event.target)) {
                setShowSchedule(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`/api/search/teachers?query=${encodeURIComponent(searchQuery)}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setSearchResults(data);
            setCourse(data.filter(item => item.isapproved));
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleScheduleClick = (schedule) => {
        setActiveSchedule(schedule);
        setShowSchedule(true);
    };

    return (
        <div className="space-y-8">
            {/* Search Section */}
            <DashboardCard>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Find Teachers</h2>
                <form onSubmit={handleSearch} className="flex gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search for teachers by name or subject..."
                                className="w-full pl-12 pr-4 py-3 rounded-lg bg-gray-50 dark:bg-[#042439] border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#4E84C1] text-gray-900 dark:text-white"
                            />
                            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-3 bg-[#4E84C1] hover:bg-[#3a6da3] text-white rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <FaSearch className="h-4 w-4" />
                        {loading ? 'Searching...' : 'Search'}
                    </button>
                </form>

                {error && (
                    <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
                        {error}
                    </div>
                )}
            </DashboardCard>

            {/* Search Results */}
            {course.length > 0 && (
                <DashboardCard>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Available Teachers</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {course.map((teacher) => (
                            <div key={teacher._id} className="bg-gray-50 dark:bg-[#042439] rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                                <div className="p-6">
                                    <div className="flex items-start space-x-4">
                                        <div className="p-3 bg-[#4E84C1]/10 rounded-lg">
                                            <FaUserCircle className="h-12 w-12 text-[#4E84C1]" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                                                {teacher.enrolledteacher.Firstname} {teacher.enrolledteacher.Lastname}
                                            </h3>
                                            <p className="text-[#4E84C1] mt-1">
                                                {teacher.coursename.toUpperCase()}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-4 space-y-2">
                                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                            <FaGraduationCap className="h-4 w-4 mr-2" />
                                            Experience: {teacher.enrolledteacher.Experience} years
                                        </div>
                                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                            <BsClockFill className="h-4 w-4 mr-2" />
                                            {teacher.schedule.map(days => 
                                                `${daysName[days.day]} ${Math.floor(days.starttime/60)}:${(days.starttime%60 === 0 ? "00":days.starttime%60)} - ${Math.floor(days.endtime/60)}:${(days.endtime%60 === 0 ? "00" : days.endtime%60)}`
                                            ).join(', ')}
                                        </div>
                                    </div>

                                    <div className="mt-6 flex items-center justify-between">
                                        <div className="flex items-center">
                                            <span className="flex items-center text-yellow-400">
                                                {[...Array(5)].map((_, i) => (
                                                    <FaStar key={i} className="h-4 w-4" />
                                                ))}
                                            </span>
                                            <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                                                5.0
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => handleScheduleClick(teacher)}
                                            className="px-4 py-2 bg-[#4E84C1] hover:bg-[#3a6da3] text-white rounded-md transition-colors text-sm"
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </DashboardCard>
            )}

            {/* Schedule Modal */}
            {showSchedule && activeSchedule && (
                <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div ref={scheduleRef} className="bg-white dark:bg-[#0a3553] rounded-lg shadow-xl max-w-2xl w-full mx-4 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Class Schedule Details
                            </h3>
                            <button
                                onClick={() => setShowSchedule(false)}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                            >
                                ✕
                            </button>
                        </div>
                        
                        <div className="space-y-6">
                            <div className="p-4 bg-gray-50 dark:bg-[#042439] rounded-lg">
                                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Teacher</h4>
                                <p className="mt-1 text-gray-900 dark:text-white">
                                    {activeSchedule.enrolledteacher.Firstname} {activeSchedule.enrolledteacher.Lastname}
                                </p>
                            </div>

                            <div className="p-4 bg-gray-50 dark:bg-[#042439] rounded-lg">
                                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Subject</h4>
                                <p className="mt-1 text-gray-900 dark:text-white">
                                    {activeSchedule.coursename.toUpperCase()}
                                </p>
                            </div>

                            <div>
                                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Schedule</h4>
                                <div className="space-y-2">
                                    {activeSchedule.schedule.map((schedule, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-[#042439] rounded-lg">
                                            <span className="text-gray-900 dark:text-white font-medium">
                                                {daysName[schedule.day]}
                                            </span>
                                            <span className="text-gray-500 dark:text-gray-400">
                                                {Math.floor(schedule.starttime/60)}:
                                                {(schedule.starttime%60 === 0 ? "00":schedule.starttime%60)} - 
                                                {Math.floor(schedule.endtime/60)}:
                                                {(schedule.endtime%60 === 0 ? "00" : schedule.endtime%60)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={() => setShowSchedule(false)}
                                    className="px-4 py-2 bg-gray-100 dark:bg-[#042439] text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-[#031c2e] transition-colors"
                                >
                                    Close
                                </button>
                                <button
                                    onClick={() => {
                                        if (!auth.user) {
                                            navigate('/login');
                                            return;
                                        }
                                        // Handle enrollment
                                    }}
                                    className="px-4 py-2 bg-[#4E84C1] hover:bg-[#3a6da3] text-white rounded-md transition-colors"
                                >
                                    Enroll Now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SearchTeacher;