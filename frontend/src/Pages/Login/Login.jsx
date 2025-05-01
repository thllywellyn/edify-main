import React, { useState } from "react";
import HR from "../Login/Images/HR.svg";
import Logo from '../Images/logo.svg';
import "./Login.css";
import { NavLink, useNavigate } from "react-router-dom";
import Radiobtn from "../Components/RadioBtn/Radiobtn";
import Header from "../Home/Header/Header";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('student');
  const [err, setErr] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const auth = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    setErr('');

    // Validation
    const newErrors = {};
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Invalid email format";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    }

    if (!userType) {
      newErrors.userType = "Please select user type";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/${userType}/login`, {
        method: 'POST',
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          Email: email, 
          Password: password 
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Login failed');
      }

      const userData = responseData.data.user;
      
      // Check if document verification is needed
      if (!userData.Isverified || !userData.Teacherdetails) {
        const docPath = userType === 'student' ? 'StudentDocument' : 'TeacherDocument';
        await auth.login(userData, userType);
        navigate(`/${docPath}/${userData._id}`);
        return;
      }

      // Let AuthContext handle the rest of the navigation based on user status
      await auth.login(userData, userType);
      
    } catch (error) {
      setErr(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTeacherSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const res = await fetch(`/api/teacher/login`, {
        method: 'POST',
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          Email: email, 
          Password: password 
        }),
      });

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(responseData.message || 'Login failed');
      }

      if (!responseData.data.Isverified) {
        // Redirect to email verification page if email is not verified
        navigate('/verify-email', { 
          state: { 
            email: email,
            userType: 'teacher'
          } 
        });
        return;
      }

      // Let AuthContext handle the rest of the navigation based on user status
      await auth.login(responseData.data, 'teacher');
      
    } catch (error) {
      setErr(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      <section className="min-h-screen flex flex-col md:flex-row items-center bg-gradient-to-br from-[#042439] via-[#0a3553] to-[#042439] p-4">
        {/* Left side - Image */}
        <div className="w-full md:w-1/2 p-4 md:p-12 flex items-center justify-center">
          <div className="bg-white/10 backdrop-blur-sm p-4 md:p-8 rounded-2xl w-full max-w-[600px] mx-auto">
            <img 
              src={HR} 
              className="w-full h-auto object-contain mx-auto" 
              alt="Learning illustration" 
            />
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className="w-full md:w-1/2 p-4 md:p-12">
          <div className="max-w-[450px] mx-auto bg-white/10 backdrop-blur-md p-6 md:p-8 rounded-2xl shadow-xl">
            <div className="flex justify-center items-center gap-2 mb-6 md:mb-8">
              <img src={Logo} alt="logo" className="w-10 md:w-12" />
              <h1 className="text-xl md:text-2xl text-white font-bold">Edify</h1>
            </div>

            <div className="text-center mb-6 md:mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">WELCOME BACK!</h2>
              <h5 className="text-gray-200 text-sm md:text-base">Please Log Into Your Account</h5>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
              <div>
                <input
                  type="text"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-300 focus:outline-none focus:border-[#4E84C1] transition-all"
                />
              </div>

              <div>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-300 focus:outline-none focus:border-[#4E84C1] transition-all"
                />
              </div>

              <div className="radio-btn">
                <Radiobtn userType={userType} setUserType={setUserType} />
              </div>

              <button 
                type="submit" 
                className="w-full bg-[#4E84C1] text-white py-4 px-6 rounded-lg 
                hover:bg-[#3a6da3] hover:scale-[1.02] transition-all duration-200 
                disabled:opacity-50 disabled:hover:scale-100 
                shadow-lg hover:shadow-xl 
                text-base font-semibold flex items-center justify-center"
                disabled={isLoading}
              >
                {isLoading ? 'Logging in...' : 'Log In'}
              </button>

              <div className="flex flex-col items-center gap-3 text-sm">
                <div className="text-white">
                  <span>Don't have an account? </span>
                  <NavLink to="/signup" className="text-[#4E84C1] font-semibold hover:text-[#3a6da3]">
                    Sign up
                  </NavLink>
                </div>

                <div 
                  className="text-[#4E84C1] font-semibold hover:text-[#3a6da3] cursor-pointer" 
                  onClick={() => navigate('/forgetpassword')}
                >
                  Forgot Password?
                </div>
              </div>

              {err && (
                <p className="text-red-300 text-sm text-center">{err}</p>
              )}
              {errors.general && (
                <div className="text-red-300 text-sm text-center">{errors.general}</div>
              )}
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
