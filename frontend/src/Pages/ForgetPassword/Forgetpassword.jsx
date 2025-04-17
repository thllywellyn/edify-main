import React, { useState } from 'react'
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import Radiobtn from '../Components/RadioBtn/Radiobtn';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const Forgetpassword = () => {
  const [userType, setUserType] = useState('');
  const [data, setData] = useState({ email: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value
    });
  };

  const onFormSubmit = async (e) => {
    e.preventDefault();

    if (!data.email) {
      toast.error('Email is required');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      toast.error('Please provide a valid email');
      return;
    }

    try {
      const response = await axios.post(`/api/${userType}/forgetpassword`, { Email: data.email});
      console.log(response.data);
      toast.success('Email sent successfully');
    } catch (error) {

      toast.error('An error occurred while sending the email');
    }
  };

  console.log(userType);

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#042439] via-[#0a3553] to-[#042439]">
      <form 
        noValidate 
        className="w-full max-w-[450px] mx-4 bg-white/10 backdrop-blur-md p-6 md:p-8 rounded-2xl shadow-xl"
        onSubmit={onFormSubmit}
      >
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">Forgot Your Password?</h1>
        <p className="text-gray-200 text-sm md:text-base mb-6">Enter your email address below to reset your password.</p>
        
        <div className="space-y-4 md:space-y-6">
          <div>
            <label htmlFor="email" className="block text-white text-sm font-medium mb-2">Email Address</label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Enter your email"
              value={data.email}
              onChange={handleChange}
              className="w-full p-3 border bg-white/20 border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4E84C1] text-white placeholder-gray-300"
            />
          </div>

          <div className="radio-btn">
            <Radiobtn userType={userType} setUserType={setUserType} />
          </div>

          <div className="flex items-center justify-between mt-6">
            <button 
              type="submit"
              className="bg-[#4E84C1] text-white py-3 px-6 rounded-lg hover:bg-[#3a6da3] hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl font-semibold"
            >
              Send
            </button>
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-[#4E84C1] hover:text-[#3a6da3] font-semibold"
            >
              <IoArrowBack /> Go back
            </button>
          </div>
        </div>
      </form>
    </section>
  );
};

export default Forgetpassword;
