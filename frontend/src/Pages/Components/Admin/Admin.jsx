import React, { useState, useEffect } from "react";
import { IoIosNotificationsOutline } from "react-icons/io";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import logo from '../../Images/logo.svg'
import Course from "./Course";
import axios from "axios";

const Admin = () => {
  const { data } = useParams();
  const navigator = useNavigate();

  const [StudentData, setStudentData] = useState([]);
  const [TeacherData, setTeacherData] = useState([]);
  const [adminID, setAdminID] = useState(null);
  const [error, setErrors] = useState("");
  const [allmsg, setAllMsg] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const getAllMsg = async () => {
      try {
        const response = await fetch(`/api/admin/messages/all`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        setAllMsg(data.data);
      } catch (err) {
        console.log(err.message);
      }
    };
    getAllMsg();
  }, []);

  const Approval = async (ID, type, approve) => {
    try {
      const data = {
        Isapproved: approve,
      };

      const response = await fetch(`/api/admin/${adminID}/approve/${type}/${ID}`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (type === "student") {
        setStudentData(pre => pre.filter((pre) => pre._id !== ID));
      } else if (type === "teacher") {
        setTeacherData(pre => pre.filter((pre) => pre._id !== ID));
      }
    } catch (error) {
      setErrors(error.message);
    }
  };

  const docDetails = async (type, ID) => {
    navigator(`/VarifyDoc/${type}/${adminID}/${ID}`);
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch(`/api/admin/${data}/approve`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        } else {
          const result = await response.json();

          setStudentData(result.data.studentsforApproval);
          setTeacherData(result.data.teachersforApproval);
          setAdminID(result.data.admin._id);
        }
      } catch (err) {
        console.log(err.message);
      }
    };
    getData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#042439] via-[#0a3553] to-[#042439]">
      <nav className="bg-white/10 backdrop-blur-md p-4 flex justify-between items-center">
        <NavLink to='/' className="flex items-center gap-3 hover:opacity-90 transition-opacity">
          <img src={logo} className="w-12" alt="Edify Logo" />
          <h1 className="text-2xl text-white font-bold">Edify</h1>
        </NavLink>

        <div className="flex items-center gap-6">
          <div className="relative cursor-pointer group">
            <IoIosNotificationsOutline className="h-7 w-7 text-white hover:text-[#4E84C1] transition-colors" />
            <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
            <span className="absolute hidden group-hover:block top-full right-0 mt-1 px-2 py-1 bg-white/10 backdrop-blur-md text-white text-xs rounded">
              Notifications
            </span>
          </div>

          <button
            onClick={() => navigator('/')}
            className="bg-[#4E84C1] text-white px-6 py-2 rounded-lg hover:bg-[#3a6da3] transition-all duration-200 font-semibold"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="p-6 md:p-8 lg:p-10">
        <div className="flex flex-wrap justify-between items-start gap-4 mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white border-b-2 border-[#4E84C1] pb-2">
            All New Requests
          </h1>

          <div className="flex gap-4">
            <button
              onClick={() => setOpen(prev => !prev)}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-all duration-200 font-semibold"
            >
              Messages
            </button>

            <button
              onClick={() => navigator(`/admin/course/${data}`)}
              className="bg-[#4E84C1] hover:bg-[#3a6da3] text-white px-6 py-3 rounded-lg transition-all duration-200 font-semibold"
            >
              Course Requests
            </button>
          </div>
        </div>

        {open && (
          <div className="mt-4 w-full max-w-2xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 space-y-4">
              {allmsg.map((msg, index) => (
                <div key={index} className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-all duration-200">
                  <div className="grid grid-cols-[auto,1fr] gap-2 text-white">
                    <span className="font-semibold">Name:</span>
                    <span>{msg.name}</span>

                    <span className="font-semibold">Email:</span>
                    <span className="text-[#4E84C1]">{msg.email}</span>

                    <span className="font-semibold">Message:</span>
                    <span>{msg.message}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;