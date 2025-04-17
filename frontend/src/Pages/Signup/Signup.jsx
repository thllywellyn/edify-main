import React, { useState } from "react";
import Images from "../Images/Meet-the-team.svg";
import Logo from '../Images/logo.svg';
import "./Styles.css";
import { NavLink, useNavigate } from "react-router-dom";
import Radiobtn from "../Components/RadioBtn/Radiobtn";
import Header from "../Home/Header/Header";

const Signup = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: "student"
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!formData.firstname.trim()) {
      newErrors.firstname = 'First name is required';
    }

    if (!formData.lastname.trim()) {
      newErrors.lastname = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    const data = {
      Firstname: formData.firstname,
      Lastname: formData.lastname,
      Email: formData.email,
      Password: formData.password,
    };

    try {
      const response = await fetch(`/api/${formData.userType}/signup`, {
        method: "POST",
        mode: "cors",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (response.ok) {
        navigate('/varifyEmail');
      } else if (response.status === 400) {
        setErrors(responseData.errors || {});
      } else {
        console.error("Registration failed with status code:", response.status);
      }
    } catch (error) {
      setErrors({ general: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      <section className="min-h-screen flex flex-col md:flex-row items-center bg-gradient-to-br from-[#042439] via-[#0a3553] to-[#042439] p-4">
        {/* Left side - Form */}
        <div className="w-full md:w-1/2 p-4 md:p-12">
          <div className="max-w-[450px] mx-auto bg-white/10 backdrop-blur-md p-6 md:p-8 rounded-2xl shadow-xl">
            <div className="flex justify-center items-center gap-2 mb-6 md:mb-8">
              <img src={Logo} alt="logo" className="w-10 md:w-12" />
              <h1 className="text-xl md:text-2xl text-white font-bold">Edify</h1>
            </div>

            <div className="text-center mb-6 md:mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Create Account</h2>
              <h5 className="text-gray-200 text-sm md:text-base">Join our learning community today</h5>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    name="firstname"
                    placeholder="First Name"
                    value={formData.firstname}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-300 focus:outline-none focus:border-[#4E84C1] transition-all"
                  />
                  {errors.firstname && <span className="text-red-300 text-xs">{errors.firstname}</span>}
                </div>
                <div>
                  <input
                    type="text"
                    name="lastname"
                    placeholder="Last Name"
                    value={formData.lastname}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-300 focus:outline-none focus:border-[#4E84C1] transition-all"
                  />
                  {errors.lastname && <span className="text-red-300 text-xs">{errors.lastname}</span>}
                </div>
              </div>

              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-300 focus:outline-none focus:border-[#4E84C1] transition-all"
                />
                {errors.email && <span className="text-red-300 text-xs">{errors.email}</span>}
              </div>

              <div>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-300 focus:outline-none focus:border-[#4E84C1] transition-all"
                />
                {errors.password && <span className="text-red-300 text-xs">{errors.password}</span>}
              </div>

              <div>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-300 focus:outline-none focus:border-[#4E84C1] transition-all"
                />
                {errors.confirmPassword && <span className="text-red-300 text-xs">{errors.confirmPassword}</span>}
              </div>

              <div className="radio-btn">
                <Radiobtn userType={formData.userType} setUserType={(type) => setFormData(prev => ({ ...prev, userType: type }))} />
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
                {isLoading ? 'Creating Account...' : 'Sign Up'}
              </button>

              <div className="text-center text-white">
                <span>Already have an account? </span>
                <NavLink to="/Login" className="text-[#4E84C1] font-semibold hover:text-[#3a6da3]">
                  Login
                </NavLink>
              </div>
            </form>
          </div>
        </div>

        {/* Right side - Image */}
        <div className="w-full md:w-1/2 p-4 md:p-12 flex items-center justify-center">
          <div className="bg-white/10 backdrop-blur-sm p-4 md:p-8 rounded-2xl w-full max-w-[600px] mx-auto">
            <img src={Images} className="w-full h-auto object-contain mx-auto" alt="Signup illustration" />
          </div>
        </div>
      </section>
    </>
  );
};

export default Signup;
