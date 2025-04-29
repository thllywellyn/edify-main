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

    // Initial load of all courses
    useEffect(() => {
        const fetchAllCourses = async () => {
            try {
                const response = await fetch('/api/course/all');
                if (!response.ok) {
                    throw new Error('Failed to fetch courses');
                }
                const data = await response.json();
                if (data.statusCode === 200) {
                    setAllCourses(data.data.filter(course => course.isapproved));
                }
            } catch (error) {
                setError('Failed to load courses. Please try again later.');
            }
        };
        fetchAllCourses();
    }, []);

    const handleSearch = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (!searchQuery.trim()) {
                // If search is empty, show all courses
                setCourse([]);
                return;
            }

            const subject = searchQuery.toLowerCase();
            // Fetch searched courses
            const searchResponse = await fetch(`/api/course/${subject}`);
            if (!searchResponse.ok) {
                throw new Error('Failed to fetch search results');
            }

            const searchData = await searchResponse.json();
            if (searchData.statusCode === 200) {
                setCourse(searchData.data.filter(course => course.isapproved));
                
                // Update allCourses to show other courses
                const otherCourses = allCourses.filter(course => 
                    course.coursename.toLowerCase() !== subject
                );
                setAllCourses(otherCourses);
            }
        } catch (error) {
            setError('Failed to search courses. Please try again.');
            console.error('Search error:', error);
        } finally {
            setLoading(false);
            setSearchQuery(''); // Clear search input after search
        }
    };

    const handleScheduleClick = (schedule) => {
        setActiveSchedule(schedule);
        setShowSchedule(true);
    };

    const handleEnroll = async (course) => {
        if (!auth.user) {
            navigate('/login');
            return;
        }

        try {
            // First verify if student can enroll
            const verifyResponse = await fetch(
                `/api/course/${course.coursename}/${course._id}/verify/student/${auth.user._id}`,
                {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );

            if (!verifyResponse.ok) {
                const error = await verifyResponse.json();
                alert(error.message || 'Cannot enroll in this course');
                return;
            }

            // Validate course price
            if (!course.price || course.price <= 0) {
                alert('Invalid course price. Please contact support.');
                return;
            }

            // Initialize Razorpay payment
            const fees = course.price * 100;
            const paymentResponse = await fetch(`/api/payment/course/${course._id}/${course.coursename}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ fees }),
            });

            const paymentData = await paymentResponse.json();
            if (!paymentResponse.ok) {
                throw new Error(paymentData.message || 'Failed to initialize payment');
            }

            // Get Razorpay key
            const keyResponse = await fetch("/api/payment/razorkey");
            const keyData = await keyResponse.json();

            const options = {
                key: keyData.data.key,
                amount: course.price * 100,
                currency: "INR",
                name: "Edify",
                description: `Enrollment in ${course.coursename.toUpperCase()} course`,
                order_id: paymentData.data.id,
                handler: async function (response) {
                    try {
                        // Verify payment
                        const verificationResponse = await fetch(
                            `/api/payment/confirmation/course/${course._id}`,
                            {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                    razorpay_payment_id: response.razorpay_payment_id,
                                    razorpay_order_id: response.razorpay_order_id,
                                    razorpay_signature: response.razorpay_signature,
                                }),
                            }
                        );

                        const verificationResult = await verificationResponse.json();
                        
                        if (verificationResult.statusCode === 200) {
                            // If payment is verified, proceed with enrollment
                            const enrollResponse = await fetch(
                                `/api/course/${course.coursename}/${course._id}/add/student/${auth.user._id}`,
                                {
                                    method: 'POST',
                                    credentials: 'include',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    }
                                }
                            );

                            const enrollData = await enrollResponse.json();
                            if (enrollResponse.ok) {
                                alert('Successfully enrolled in the course!');
                                // Refresh the course list
                                window.location.reload();
                            } else {
                                throw new Error(enrollData.message || 'Failed to complete enrollment');
                            }
                        } else {
                            throw new Error('Payment verification failed');
                        }
                    } catch (error) {
                        alert(error.message);
                    }
                },
                prefill: {
                    name: auth.user.Firstname + ' ' + auth.user.Lastname,
                    email: auth.user.Email,
                },
                theme: {
                    color: "#4E84C1"
                }
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();

        } catch (error) {
            console.error('Error in enrollment process:', error);
            alert(error.message || 'Failed to process enrollment');
        }
    };

    const openTeacherDec = async (id, fname, lname, sub) => {
        try {
            const data = await fetch('/api/teacher/teacherdocuments', {
                method: 'POST',
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ teacherID: id }),
            });

            if (!data.ok) {
                throw new Error('Failed to fetch teacher details');
            }

            const res = await data.json();
            if (res.data) {
                setTeacherDetails(res.data);
                setOpenTM(true);
            }
        } catch (error) {
            setError('Failed to load teacher details. Please try again.');
            console.error('Error fetching teacher details:', error);
        }
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
                                        <button
                                            onClick={() => handleEnroll(teacher)}
                                            className="px-4 py-2 bg-[#4E84C1] hover:bg-[#3a6da3] text-white rounded-md transition-colors text-sm"
                                        >
                                            Enroll Now
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
                    <div ref={scheduleRef} className="bg-white dark:bg-[#0a3553] rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white dark:bg-[#0a3553] border-b border-gray-200 dark:border-gray-700 p-4 z-10">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Class Schedule Details
                                </h3>
                                <button
                                    onClick={() => setShowSchedule(false)}
                                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                        
                        <div className="p-4 space-y-4">
                            <div className="bg-gray-50 dark:bg-[#042439] rounded-lg p-3">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Teacher</h4>
                                        <p className="mt-1 text-gray-900 dark:text-white">
                                            {activeSchedule.enrolledteacher.Firstname} {activeSchedule.enrolledteacher.Lastname}
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Subject</h4>
                                        <p className="mt-1 text-gray-900 dark:text-white">
                                            {activeSchedule.coursename.toUpperCase()}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Weekly Schedule</h4>
                                <div className="space-y-2">
                                    {activeSchedule.schedule.map((schedule, index) => (
                                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-[#042439] rounded-lg text-sm">
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

                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    onClick={() => setShowSchedule(false)}
                                    className="px-3 py-1.5 bg-gray-100 dark:bg-[#042439] text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-[#031c2e] transition-colors text-sm"
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
                                    className="px-3 py-1.5 bg-[#4E84C1] hover:bg-[#3a6da3] text-white rounded-md transition-colors text-sm"
                                >
                                    Enroll Now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Teacher Details Modal */}
            {openTM && teacherDetails && (
                <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-[#0a3553] w-full max-w-md mx-4 rounded-lg shadow-xl">
                        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Teacher Details
                            </h3>
                            <button
                                onClick={() => setOpenTM(false)}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                            >
                                ✕
                            </button>
                        </div>
                        
                        <div className="p-4 max-h-[80vh] overflow-y-auto">
                            <div className="space-y-4">
                                <div className="p-4 bg-gray-50 dark:bg-[#042439] rounded-lg">
                                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Course</h4>
                                    <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                                        {activeSchedule?.coursename.toUpperCase()}
                                    </p>
                                </div>

                                <div className="p-4 bg-gray-50 dark:bg-[#042439] rounded-lg">
                                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Education</h4>
                                    <div className="mt-2 space-y-2">
                                        <p className="text-gray-900 dark:text-white">
                                            <span className="font-medium">Postgraduate:</span> {teacherDetails.PGcollege} ({teacherDetails.PGmarks} CGPA)
                                        </p>
                                        <p className="text-gray-900 dark:text-white">
                                            <span className="font-medium">Graduate:</span> {teacherDetails.UGcollege} ({teacherDetails.UGmarks} CGPA)
                                        </p>
                                    </div>
                                </div>

                                <div className="p-4 bg-gray-50 dark:bg-[#042439] rounded-lg">
                                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Experience</h4>
                                    <p className="mt-1 text-gray-900 dark:text-white">
                                        {teacherDetails.Experience} years of teaching experience
                                    </p>
                                </div>

                                <div className="p-4 bg-gray-50 dark:bg-[#042439] rounded-lg">
                                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Contact Details</h4>
                                    <div className="mt-2 space-y-2">
                                        <p className="text-gray-900 dark:text-white">
                                            <span className="font-medium">Phone:</span> {teacherDetails.Phone}
                                        </p>
                                        <p className="text-gray-900 dark:text-white">
                                            <span className="font-medium">Address:</span> {teacherDetails.Address}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SearchTeacher;