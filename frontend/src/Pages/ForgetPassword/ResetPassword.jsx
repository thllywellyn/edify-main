import React, { useState } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';

import { useNavigate, useParams } from 'react-router-dom';

const ResetPassword = () => {
  const [data, setData] = useState({
    password: '',
    confirmPassword: ''
  });

  const navigate=useNavigate()

  const { token }=useParams()

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const { password, confirmPassword } = data;

    // Validation checks
    if (!password || !confirmPassword) {
      toast.error("Both fields are required");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    const response= axios.post(`/api/student/forgetpassword/${token}`,{password:data.password,confirmPassword:data.confirmPassword})
     toast.promise(response,{
        loading:"wait for processing",
        success:(response)=> response?.data?.message,
        error:"Time limit Reached Try again"
        
     }) 

     if((await response).data.success){
       navigate('/login')
     }
   
  
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#042439] via-[#0a3553] to-[#042439]">
      <form 
        noValidate 
        className="w-full max-w-[450px] mx-4 bg-white/10 backdrop-blur-md p-6 md:p-8 rounded-2xl shadow-xl"
        onSubmit={handleSubmit}
      >
        <h1 className="text-xl md:text-2xl font-bold text-white mb-6 text-center">
          This link is valid for 15 mins otherwise password will not be updated
        </h1>
        
        <div className="space-y-4 md:space-y-6">
          <div>
            <label htmlFor="password" className="block text-white text-sm font-medium mb-2">
              New Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Enter your password..."
              value={data.password}
              onChange={handleChange}
              className="w-full p-3 border bg-white/20 border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4E84C1] text-white placeholder-gray-300"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-white text-sm font-medium mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm your password..."
              value={data.confirmPassword}
              onChange={handleChange}
              className="w-full p-3 border bg-white/20 border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4E84C1] text-white placeholder-gray-300"
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-[#4E84C1] text-white py-3 px-6 rounded-lg hover:bg-[#3a6da3] hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl font-semibold mt-6"
          >
            Submit
          </button>
          
          <p className="text-red-300 text-sm mt-4">
            * Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.
          </p>
        </div>
      </form>
    </div>
  );
};

export default ResetPassword;
