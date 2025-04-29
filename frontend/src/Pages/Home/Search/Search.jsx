import React, { useEffect, useState, useRef } from 'react'
import { NavLink, useParams, useNavigate } from 'react-router-dom';
import Header from '../Header/Header'
import { useAuth } from '../../../context/AuthContext';

function search() {
    const { subject } = useParams();
    const navigate = useNavigate();
    const auth = useAuth();
    const [data, setData] = useState(subject || '');
    const [course, setCourse] = useState([]);
    const [openTM, setOpenTM] = useState(false);
    const [teacherDetails, setTeacherDetails] = useState(null); // renamed from Tdec for clarity
    const [tname, setTname] = useState({});
    const [starCount, setStarCount] = useState(5);
    const [showSchedule, setShowSchedule] = useState(false);
    const [activeSchedule, setActiveSchedule] = useState(null);
    const scheduleRef = useRef(null);
    const [allCourses, setAllCourses] = useState([]);

    const price = {
        math: 700,
        physics: 800,
        computer: 1000,
        chemistry: 600,
        biology: 500,
    };

    const daysName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    
    let SearchTeacher = async()=>{
        try {
            if (!data.trim()) {
                // If search is empty, just fetch all courses
                let allData = await fetch('/api/course/all')
                let allResponse = await allData.json();
                if(allResponse.statusCode == 200){
                    setCourse([]);
                    setAllCourses(allResponse.data);
                }
                return;
            }

            let Subject = data.toLowerCase();
            // Fetch searched courses
            let Data = await fetch(`/api/course/${Subject}`)
            let response = await Data.json();
            if(response.statusCode == 200){
                setCourse(response.data)
            }

            // Fetch all courses
            let allData = await fetch('/api/course/all')
            let allResponse = await allData.json();
            if(allResponse.statusCode == 200){
                const otherCourses = allResponse.data.filter(course => 
                    course.coursename.toLowerCase() !== Subject
                );
                setAllCourses(otherCourses);
            }
        } catch (error) {
            console.error("Error fetching courses:", error);
        }
        setData('')
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            SearchTeacher();
        }
    }

    useEffect(()=>{
        SearchTeacher();
    },[])

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (scheduleRef.current && !scheduleRef.current.contains(event.target)) {
                setShowSchedule(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const openTeacherDec = async(id,fname,lname,sub)=>{
        try {
            setTname({fname,lname,sub});

            const data = await fetch('/api/teacher/teacherdocuments',{
                method: 'POST',
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({teacherID : id}),
            });

            const res = await data.json();
            if (res.data) {
                setTeacherDetails(res.data);
                setOpenTM(true);
            } else {
                throw new Error('No teacher data received');
            }
        } catch (error) {
            console.error('Error fetching teacher details:', error);
            alert('Failed to load teacher details');
        }
    }

    const handleEnroll = () => {
        if (!auth.user) {
            navigate('/login');
            return;
        }
        // Existing enrollment logic
    }

    const handleScheduleClick = (schedule) => {
        setActiveSchedule(schedule);
        setShowSchedule(true);
    };

    const isEnrolled = (course) => {
        return course.enrolledStudent?.some(studentId => studentId === auth.user?._id);
    };

    return (
        <>
            <Header/>
            <div className='flex flex-col items-center justify-center'>
                <div className="search mb-16">  {/* Changed mb-10 to mb-16 for more space */}
                    <img src="https://www.figma.com/file/6b4R8evBkii6mI53IA4vSS/image/6c476f454537d7f27cae2b4d0f31e2b59b3020f5" width={30} alt="" />
                    <input 
                        type="text" 
                        placeholder='Ex: Math ...' 
                        value={data} 
                        onChange={(e)=>setData(e.target.value)}
                        onKeyPress={handleKeyPress}
                    />
                    <button className='w-32' onClick={SearchTeacher}>Find Teacher</button>
                </div>
                <div className='w-[90%] max-w-[1200px] overflow-auto pt-4'> {/* Added pt-4 for top padding */}
                    {/* Searched Courses */}
                    {course && course.length > 0 && (
                        <>
                            <h2 className='text-2xl font-bold text-white mb-4'>Search Results</h2>
                            {course.map((Data) => (
                                <div key={Data._id} className='bg-white rounded-lg shadow-md mb-4 p-6 hover:shadow-lg transition-shadow'>
                                    <div className='flex justify-between items-start mb-4'>
                                        <div>
                                            <h2 className='text-2xl font-bold text-blue-900 mb-2'>
                                                {Data.coursename.toUpperCase()}
                                            </h2>
                                            <p className='text-gray-600 mb-2 cursor-pointer hover:text-blue-600'
                                               onClick={() => openTeacherDec(Data.enrolledteacher.Teacherdetails, Data.enrolledteacher.Firstname, Data.enrolledteacher.Lastname, Data.coursename)}>
                                                {Data.enrolledteacher.Firstname} {Data.enrolledteacher.Lastname}
                                            </p>
                                        </div>
                                        <div className='flex flex-col items-end'>
                                            <span className='bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm mb-2'>
                                                {Data.enrolledStudent.length}/20 Students
                                            </span>
                                            <button 
                                                onClick={() => !isEnrolled(Data) && handleEnroll()}
                                                className={`${
                                                    isEnrolled(Data) 
                                                    ? 'bg-green-600 cursor-not-allowed' 
                                                    : 'bg-blue-600 hover:bg-blue-700'
                                                } text-white px-6 py-2 rounded-md transition-colors min-w-[140px]`}
                                                disabled={isEnrolled(Data)}
                                            >
                                                {isEnrolled(Data) ? 'Enrolled' : 'Enroll Now'}
                                            </button>
                                        </div>
                                    </div>
                                    <p className='text-gray-700 mb-4'><span className='font-semibold'>Description:</span> {Data.description}</p>
                                    <div className='flex gap-2'>
                                        <button 
                                            onClick={() => handleScheduleClick(Data.schedule)}
                                            className='bg-blue-100 text-blue-800 px-4 py-2 rounded-md hover:bg-blue-200 transition-colors min-w-[140px]'>
                                            Schedule
                                        </button>
                                    </div>
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
                                    <div className='flex justify-between items-start mb-4'>
                                        <div>
                                            <h2 className='text-2xl font-bold text-blue-900 mb-2'>
                                                {Data.coursename.toUpperCase()}
                                            </h2>
                                            <p className='text-gray-600 mb-2 cursor-pointer hover:text-blue-600'
                                               onClick={() => openTeacherDec(Data.enrolledteacher.Teacherdetails, Data.enrolledteacher.Firstname, Data.enrolledteacher.Lastname, Data.coursename)}>
                                                {Data.enrolledteacher.Firstname} {Data.enrolledteacher.Lastname}
                                            </p>
                                        </div>
                                        <div className='flex flex-col items-end'>
                                            <span className='bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm mb-2'>
                                                {Data.enrolledStudent.length}/20 Students
                                            </span>
                                            <button 
                                                onClick={() => !isEnrolled(Data) && handleEnroll()}
                                                className={`${
                                                    isEnrolled(Data) 
                                                    ? 'bg-green-600 cursor-not-allowed' 
                                                    : 'bg-blue-600 hover:bg-blue-700'
                                                } text-white px-6 py-2 rounded-md transition-colors min-w-[140px]`}
                                                disabled={isEnrolled(Data)}
                                            >
                                                {isEnrolled(Data) ? 'Enrolled' : 'Enroll Now'}
                                            </button>
                                        </div>
                                    </div>
                                    <p className='text-gray-700 mb-4'><span className='font-semibold'>Description:</span> {Data.description}</p>
                                    <div className='flex gap-2'>
                                        <button 
                                            onClick={() => handleScheduleClick(Data.schedule)}
                                            className='bg-blue-100 text-blue-800 px-4 py-2 rounded-md hover:bg-blue-200 transition-colors min-w-[140px]'>
                                            Schedule
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </>
                    )}
                </div>

                {/* Schedule Modal */}
                {showSchedule && activeSchedule && (
                    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                        <div ref={scheduleRef} className="bg-white rounded-lg p-6 w-[800px] max-w-[90%]">
                            <h3 className="text-xl font-bold mb-4">Weekly Schedule</h3>
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th className="border p-2">Day</th>
                                        <th className="border p-2">Start Time</th>
                                        <th className="border p-2">End Time</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {activeSchedule.map((slot, index) => (
                                        <tr key={index}>
                                            <td className="border p-2">{daysName[slot.day]}</td>
                                            <td className="border p-2">
                                                {`${Math.floor(slot.starttime / 60)}:${slot.starttime % 60 === 0 ? "00" : slot.starttime % 60}`}
                                            </td>
                                            <td className="border p-2">
                                                {`${Math.floor(slot.endtime / 60)}:${slot.endtime % 60 === 0 ? "00" : slot.endtime % 60}`}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Teacher Details Modal */}
                {openTM && teacherDetails && (
                    <div className='fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center'>
                        <div className='bg-[#008280] w-96 h-[21rem] rounded-md'>
                            <div className='absolute w-9 h-9 bg-white rounded-xl cursor-pointer flex items-center justify-center m-2' 
                                 onClick={()=>setOpenTM(false)}>✖️</div>
                            <div className='flex flex-col justify-center p-5 text-1xl gap-4'>
                                <p className='text-center text-2xl bg-blue-900 rounded-sm py-1 text-white mb-5'>{tname.sub.toUpperCase()}</p>
                                <p>Teacher Name : <span className='text-gray-900 dark:text-white'>{tname.fname} {tname.lname}</span></p>
                                <p>Education : <span className='text-gray-900 dark:text-white'>Postgraduate from <b className='text-gray-800 dark:text-gray-200'>{teacherDetails.PGcollege}</b> with {teacherDetails.PGmarks} CGPA</span></p>
                                <p>Experience : <span className='text-gray-900 dark:text-white'>{teacherDetails.Experience} years</span></p>
                                <p>Course Name : <span className='text-gray-900 dark:text-white'>{tname.sub.toUpperCase()}</span></p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}

export default search;