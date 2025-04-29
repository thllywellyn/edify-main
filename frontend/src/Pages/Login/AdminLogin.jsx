import React, { useState, useEffect } from "react";
import "./Login.css";
import Admin from './Images/Admin.svg'
import { useNavigate } from "react-router-dom";
import Header from "../Home/Header/Header";
import { useAuth } from "../../context/AuthContext";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [err, setErr] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const navigate = useNavigate();
  const auth = useAuth();

  useEffect(() => {
    // Reset login attempts after 30 minutes
    const timer = setTimeout(() => setLoginAttempts(0), 30 * 60 * 1000);
    return () => clearTimeout(timer);
  }, [loginAttempts]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isLoading) return;
    
    // Check login attempts
    if (loginAttempts >= 5) {
      setErr("Too many login attempts. Please try again later.");
      return;
    }

    setIsLoading(true);
    setErrors({});
    setErr('');

    // Basic validation
    const newErrors = {};
    if (!username.trim()) {
      newErrors.username = "Username is required";
    } else if (username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }
    
    if (!password.trim()) {
      newErrors.password = "Password is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      setLoginAttempts(prev => prev + 1);
      
      const response = await fetch(`/api/admin/login`, {
        method: 'POST',
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: username.trim(),
          password
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          setErrors({ password: responseData.message || "Incorrect password" });
        } else if (response.status === 429) {
          setErr("Too many login attempts. Please try again later.");
        } else {
          throw new Error(responseData.message || "Login failed");
        }
        return;
      }

      // Let AuthContext handle auth state and navigation
      await auth.login(responseData.data.admin, 'admin');
      navigate(`/admin/${responseData.data.admin._id}`);
      
    } catch (error) {
      setErr(error.message);
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
    <Header/>
    <section className="main">
      {/* image */}
      <div className="img-3">
        <img src={Admin} width={500} alt="" />
      </div>
      <div className="container py-5">
        <div className="para1">
          <h2> WELCOME BACK!</h2>
        </div>

        <div className="para">
          <h5> Please Log Into Your Account.</h5>
        </div>

        <div className="form">
          <form onSubmit={handleSubmit}>
            <div className="input-1">
              <input
                type="text"
                placeholder="User name"
                className="input-0"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              {errors.username && (
                <div className="error-message">{errors.username}</div>
              )}
            </div>
            <div className="input-2">
              <input
                type="password"
                placeholder="Password"
                className="input-0"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.password && (
                <div className="error-message">{errors.password}</div>
              )}
            </div>

            {/* btns */}
            <div className="btns">
              <button type="submit" className="btns-1" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Log In"}
              </button>
            </div>
            {errors.general && (
              <div className="error-message">{errors.general}</div>
            )}
            {err && (
              <div className="error-message">{err}</div>
            )}
          </form>
        </div>
      </div>
    </section>
    </>
  );
}
