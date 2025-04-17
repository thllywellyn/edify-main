import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Popup from './Popup';
import CourseVideos from '../Components/CourseVideos';

function StudentCourses() {
  const { ID } = useParams();
  const [data, setdata] = useState([]);
  const [popup, setPopup] = useState(false);
  const [subDetails, setsubDetails] = useState({});
  const [subD, setsubD] = useState();
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch(`/api/course/student/${ID}/enrolled`, {
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
  }, [ID]);

  const openpopup = async(sub) => {
    setsubDetails(sub);
    await fetch(`/api/course/${sub.coursename}`)
      .then(res => res.json())
      .then(res => {
        setPopup(true);
        setsubD(res.data);
      });
  };

  const daysName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const Image = {
    "physics": "https://www.figma.com/file/6b4R8evBkii6mI53IA4vSS/image/8e9bf690d23d886f63466a814cfbec78187f91d2",
    "chemistry": "https://www.figma.com/file/6b4R8evBkii6mI53IA4vSS/image/3e546b344774eb0235acc6bf6dad7814a59d6e95",
    "biology": "https://www.figma.com/file/6b4R8evBkii6mI53IA4vSS/image/28ac70002ae0a676d9cfb0f298f3e453d12b5555",
    "math": "https://www.figma.com/file/6b4R8evBkii6mI53IA4vSS/image/61930117e428a1f0f7268f888a84145f93aa0664",
    "computer": "https://www.figma.com/file/6b4R8evBkii6mI53IA4vSS/image/a64c93efe984ab29f1dfb9e8d8accd9ba449f272",
  };

  return (
    <>
      <div className="flex flex-wrap gap-10 pl-[12rem] mt-12 justify-center mb-2">
        {data.map(course => (
          <div
            key={course._id}
            className="text-white rounded-lg bg-[#042439] cursor-pointer p-4 w-[20rem]"
          >
            <div 
              className="text-center mb-4"
              onClick={() => openpopup(course)}
            >
              <div className="flex justify-center items-center gap-3 mb-2">
                <img src={Image[course.coursename]} alt={course.coursename} width={60} />
                <p className="text-xl font-semibold">{course.coursename.toUpperCase()}</p>
              </div>
              <p className="text-gray-300 text-sm px-2">{course.description}</p>

              {course.schedule && (
                <div className="mt-4 text-sm">
                  <p className="text-blue-500 font-bold mb-1">Schedule:</p>
                  <p className="text-gray-300">
                    {course.schedule.map(daytime => (
                      `${daysName[daytime.day]} ${Math.floor(daytime.starttime / 60)}:${daytime.starttime % 60 === 0 ? "00" : daytime.starttime % 60} - ${Math.floor(daytime.endtime/60)}:${daytime.endtime % 60 === 0 ? "00" : daytime.endtime % 60}`
                    )).join(', ')}
                  </p>
                </div>
              )}
            </div>

            <div className="border-t border-[#9433E0]/20 pt-4">
              <button
                onClick={() => setSelectedCourse(selectedCourse === course._id ? null : course._id)}
                className="w-full bg-[#9433E0] hover:bg-[#7928b8] text-white py-2 rounded-md transition-colors"
              >
                {selectedCourse === course._id ? 'Hide Videos' : 'View Course Videos'}
              </button>

              {selectedCourse === course._id && (
                <div className="mt-4">
                  <CourseVideos courseId={course._id} />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {popup && (
        <Popup onClose={() => setPopup(false)} subject={subDetails} allSubject={subD} />
      )}
    </>
  );
}

export default StudentCourses;