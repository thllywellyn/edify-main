import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Withdrawal from "./Withdrawal";
import { TbMessage2Star } from "react-icons/tb";
import { FaChalkboardTeacher, FaUserGraduate, FaBook, FaMoneyBillWave } from "react-icons/fa";
import DashboardCard from "../Components/DashboardCard";

function DashboardTeacher() {
  const { ID } = useParams();
  const [data, setdata] = useState([]);
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState([]);
  const [popup, setPopup] = useState(false);
  const [notification, setNotification] = useState(false);
  const [amount, setAmount] = useState(0);
  const [Tdec, setTeacherDetails] = useState(null);
  const [formPopup, setFormPopup] = useState(false);
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const price = {
    math: 700,
    physics: 800,
    computer: 1000,
    chemistry: 600,
    biology: 500,
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch(`/api/Teacher/TeacherDocument/${ID}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const user = await response.json();
        setdata(user.data);
      } catch (error) {
        setError(error.message);
      }
    };
    getData();
  }, []);

  useEffect(() => {
    const getData = async () => {
      const Data = await fetch('/api/teacher/teacherdocuments', {
        method: 'POST',
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ teacherID: data.Teacherdetails }),
      });
      const res = await Data.json();
      setTeacherDetails(res.data);
    };

    getData();
  }, [courses]);

  useEffect(() => {
    const getAmount = async () => {
      try {
        const response = await fetch(`/api/payment/teacher/${ID}/balance`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const user = await response.json();
        setAmount(user.data.newTeacher.balance);
      } catch (error) {
        console.log(error);
      }
    };
    getAmount();
  }, [amount, popup]);

  useEffect(() => {
    const getCourses = async () => {
      try {
        const response = await fetch(`/api/course/Teacher/${ID}/enrolled`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const res = await response.json();
        setCourses(res.data);
      } catch (error) {
        setError(error.message);
      }
    };
    getCourses();
  }, []);

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Courses</p>
              <h3 className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">{courses.length}</h3>
            </div>
            <div className="p-3 bg-[#4E84C1]/10 rounded-lg">
              <FaBook className="h-6 w-6 text-[#4E84C1]" />
            </div>
          </div>
        </DashboardCard>

        <DashboardCard>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Students</p>
              <h3 className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">
                {courses.reduce((acc, course) => acc + (course.enrolledStudents?.length || 0), 0)}
              </h3>
            </div>
            <div className="p-3 bg-[#4E84C1]/10 rounded-lg">
              <FaUserGraduate className="h-6 w-6 text-[#4E84C1]" />
            </div>
          </div>
        </DashboardCard>

        <DashboardCard>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Experience</p>
              <h3 className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">
                {Tdec?.Experience || 0} years
              </h3>
            </div>
            <div className="p-3 bg-[#4E84C1]/10 rounded-lg">
              <FaChalkboardTeacher className="h-6 w-6 text-[#4E84C1]" />
            </div>
          </div>
        </DashboardCard>

        <DashboardCard onClick={() => setPopup(true)} hover={true}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Balance</p>
              <h3 className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">
                ₹{amount}
              </h3>
            </div>
            <div className="p-3 bg-[#4E84C1]/10 rounded-lg">
              <FaMoneyBillWave className="h-6 w-6 text-[#4E84C1]" />
            </div>
          </div>
        </DashboardCard>
      </div>

      {/* Profile & Course Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <DashboardCard>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Profile Details</h2>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 dark:bg-[#042439] rounded-lg">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Full Name</p>
              <p className="mt-1 text-gray-900 dark:text-white">{data.Firstname} {data.Lastname}</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-[#042439] rounded-lg">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</p>
              <p className="mt-1 text-gray-900 dark:text-white">{data.Email}</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-[#042439] rounded-lg">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</p>
              <p className="mt-1 text-gray-900 dark:text-white">{Tdec?.Phone || 'Not provided'}</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-[#042439] rounded-lg">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Address</p>
              <p className="mt-1 text-gray-900 dark:text-white">{Tdec?.Address || 'Not provided'}</p>
            </div>
          </div>
        </DashboardCard>

        {/* Course Schedule */}
        <DashboardCard className="lg:col-span-2">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Course Schedule</h2>
          <div className="space-y-4">
            {courses
              .filter((course) => course.isapproved)
              .map((course) => (
                <div key={course._id} className="p-4 bg-gray-50 dark:bg-[#042439] rounded-lg hover:bg-gray-100 dark:hover:bg-[#031c2e] transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-base font-medium text-gray-900 dark:text-white">
                      {course.coursename.toUpperCase()}
                    </h3>
                    <span className="text-sm font-medium text-[#4E84C1]">
                      ₹{price[course.coursename]} per student / month
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Schedule: {course.schedule.map(days => 
                      `${daysOfWeek[days.day]} ${Math.floor(days.starttime/60)}:${(days.starttime%60 === 0 ? "00":days.starttime%60)} - ${Math.floor(days.endtime/60)}:${(days.endtime%60 === 0 ? "00" : days.endtime%60)}`
                    ).join(', ')}
                  </p>
                </div>
              ))}
          </div>
        </DashboardCard>
      </div>

      {/* Modals */}
      {popup && <Withdrawal onClose={() => setPopup(false)} TA={amount} />}
      
      {formPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-[#0a3553] w-full max-w-2xl p-6 rounded-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Teacher Feedback Form</h2>
              <button onClick={() => setFormPopup(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                ✕
              </button>
            </div>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              We highly appreciate your involvement. Please help us improve by filling out this feedback form.
            </p>
            {/* Form content would go here */}
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardTeacher;
