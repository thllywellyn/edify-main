import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import Search from '../../Components/Searchbtn/Search'

function SearchTeacher() {
    const navigate = useNavigate();
    const auth = useAuth();
    const [openTM, setOpenTM] = useState(false);
    const [teacherDetails, setTeacherDetails] = useState(null);
    const [tname, setTname] = useState({});
    const [showSchedule, setShowSchedule] = useState(false);
    const [activeSchedule, setActiveSchedule] = useState(null);
    const scheduleRef = useRef(null);
    const [course, setCourse] = useState([]);
    const [allCourses, setAllCourses] = useState([]);
    const [popup, SetPopup] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchResults, setSearchResults] = useState([]);

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

    const openTeacherDec = async (id, fname, lname, sub) => {
        // Add logic for opening teacher details
    };

    const handleEnroll = () => {
        if (!auth.user) {
            navigate('/login');
            return;
        }
    };

    const handleScheduleClick = (schedule) => {
        setActiveSchedule(schedule);
        setShowSchedule(true);
    };

    const handleSearch = async (query) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`/api/search/teachers?query=${encodeURIComponent(query)}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                throw new TypeError("Response was not JSON");
            }

            const data = await response.json();

            if (!Array.isArray(data)) {
                throw new TypeError("Expected array of results");
            }

            setSearchResults(data);
        } catch (err) {
            console.error("Search error:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='ml-56 relative'>
            <Search onSearch={handleSearch} />
            {error && <div className="error-message">{error}</div>}
            {loading && <div className="loading">Loading...</div>}
            {searchResults.length > 0 && (
                <div className="search-results-container">
                    {searchResults.map(teacher => (
                        <div key={teacher.id} className="search-result-item">
                            <h3 className="text-lg font-semibold truncate hover:text-clip">{teacher.name}</h3>
                            <p className="text-sm text-gray-600 truncate hover:text-clip">{teacher.subject}</p>
                        </div>
                    ))}
                </div>
            )}
            <div className='w-[90%] max-w-[1200px] overflow-auto pt-4'>
                {/* Searched Courses */}
                {course && course.length > 0 && (
                    <>
                        <h2 className='text-2xl font-bold text-white mb-4'>Search Results</h2>
                        {course.map((Data) => (
                            <div key={Data._id} className='bg-white rounded-lg shadow-md mb-4 p-6 hover:shadow-lg transition-shadow'>
                                {/* Add course display logic */}
                            </div>
                        ))}
                    </>
                )}

                {/* Other Courses */}
                {allCourses && allCourses.length > 0 && (
                    <>
                        <h2 className='text-2xl font-bold text-white mb-4 mt-8'>Other Courses</h2>
                        {allCourses.map((Data) => (
                            <div key={Data._id} className='bg-white rounded-lg shadow-md mb-4 p-6 hover:shadow-lg transition-shadow'>
                                {/* Add other courses display logic */}
                            </div>
                        ))}
                    </>
                )}
            </div>

            {/* Schedule Modal */}
            {showSchedule && activeSchedule && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                    {/* Add schedule modal logic */}
                </div>
            )}

            {/* Teacher Details Modal */}
            {openTM && teacherDetails && (
                <div className='fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center'>
                    {/* Add teacher details modal logic */}
                </div>
            )}

            {popup && (
                <div className='fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center'>
                    <div className='bg-[#5be0de] w-[70vw] px-14 py-10 rounded-sm'>
                        <p className='text-3xl'>Student Feedback Form</p>
                        <p className=' border-b-2 py-2'>Please help us improve our courses by filling out this student feedback form. We highly appreciate your involvement. Thank you!</p>

                        <div className='flex flex-col gap-3 my-5 pb-5 border-b-2'>
                            <label>Teacher / Instructor</label>
                            <input type="text" className='p-2' placeholder='Teacher / Instructor Name' />
                            <label>Course Name</label>
                            <input type="text" className='p-2' placeholder='Course Name' />
                            <label>What you like about this course?</label>
                            <input type="text" className='p-2' placeholder='' />
                        </div>

                        <p className='font-bold'>Please rate each following statement : </p>

                        <div className='my-3'>
                            <div className='flex gap-1'>
                                <p className='mr-[1.65rem]'>Level of effort invested in course</p>
                                <input name="group" type="radio" id='one' /> <label className='mr-3' htmlFor='one'>Very Good</label>
                                <input name="group" type="radio" id='two' /> <label className='mr-3' htmlFor='two'>Good</label>
                                <input name="group" type="radio" id='three' /> <label className='mr-3' htmlFor='three'>Fair</label>
                                <input name="group" type="radio" id='four' /> <label className='mr-3' htmlFor='four'>Poor</label>
                                <input name="group" type="radio" id='five' /> <label className='mr-3' htmlFor='five'>Very Poor</label>
                            </div>
                            <div className='flex gap-1 mt-1'>
                                <p className='mr-4'>Level of knowledge on the Subject</p>
                                <input name="group-0" type="radio" id='onec' /> <label className='mr-3' htmlFor='onec'>Very Good</label>
                                <input name="group-0" type="radio" id='twoc' /> <label className='mr-3' htmlFor='twoc'>Good</label>
                                <input name="group-0" type="radio" id='threec' /> <label className='mr-3' htmlFor='threec'>Fair</label>
                                <input name="group-0" type="radio" id='fourc' /> <label className='mr-3' htmlFor='fourc'>Poor</label>
                                <input name="group-0" type="radio" id='fivec' /> <label className='mr-3' htmlFor='fivec'>Very Poor</label>
                            </div>
                            <div className='flex gap-1 mt-1'>
                                <p className='mr-[5.48rem]'>Level of communication</p>
                                <input name="group-1" type="radio" id='oned' /> <label className='mr-3' htmlFor='oned'>Very Good</label>
                                <input name="group-1" type="radio" id='twod' /> <label className='mr-3' htmlFor='twod'>Good</label>
                                <input name="group-1" type="radio" id='threed' /> <label className='mr-3' htmlFor='threed'>Fair</label>
                                <input name="group-1" type="radio" id='fourd' /> <label className='mr-3' htmlFor='fourd'>Poor</label>
                                <input name="group-1" type="radio" id='fived' /> <label className='mr-3' htmlFor='fived'>Very Poor</label>
                            </div>
                        </div>

                        <div className='py-3'>
                            <p className='pb-3'>Would you recommend this course to other students?</p>
                            <input name="radio-group" type="radio" id='one' /> <label htmlFor='one'>Yes</label>
                            <input name="radio-group" type="radio" id='two' className='ml-5' /> <label htmlFor='two'>No</label>
                        </div>

                        <div className='flex justify-center'>
                            <button className='w-[10rem]'>Submit Form</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default SearchTeacher