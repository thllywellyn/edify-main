import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        try {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const userSession = JSON.parse(storedUser);
                const sessionAge = new Date().getTime() - userSession.timestamp;
                if (sessionAge > 24 * 60 * 60 * 1000) {
                    localStorage.removeItem('user');
                    setUser(null);
                } else {
                    setUser(userSession.data);
                    // Auto-redirect if on login pages
                    const path = window.location.pathname;
                    if (path === '/login' || path === '/adminLogin') {
                        handleRedirect(userSession.data);
                    }
                }
            }
        } catch (err) {
            console.error('Auth initialization error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    const handleRedirect = (userData) => {
        if (!userData) return;

        // Admin redirection
        if (userData.type === 'admin') {
            navigate(`/admin/${userData._id}`);
            return;
        }

        // Student/Teacher redirection based on status
        switch (userData.status) {
            case "pending":
                if (userData.Teacherdetails || userData.Studentdetails) {
                    navigate('/pending');
                } else {
                    navigate(`/${userData.type}Document/${userData._id}`);
                }
                break;
            case "approved":
                const dashboardPath = userData.type === 'student' ? 'search' : 'home';
                navigate(`/dashboard/${userData.type}/${userData._id}/${dashboardPath}`);
                break;
            case "reupload":
                navigate(`/rejected/${userData.type}/${userData._id}`);
                break;
            default:
                navigate('/');
        }
    };

    const login = async (userData, userType) => {
        try {
            setLoading(true);
            setError(null);
            const userWithType = { ...userData, type: userType };
            setUser(userWithType);
            
            // Store in localStorage with timestamp
            const userSession = {
                data: userWithType,
                timestamp: new Date().getTime()
            };
            localStorage.setItem('user', JSON.stringify(userSession));

            // Handle redirection
            handleRedirect(userWithType);
            
        } catch (err) {
            console.error('Login error:', err);
            setError(err.message);
            setUser(null);
            localStorage.removeItem('user');
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            const userType = user?.type || 'student';
            await fetch(`/api/${userType}/logout`, {
                method: 'POST',
                credentials: 'include'
            });
            setUser(null);
            localStorage.removeItem('user');
            navigate(userType === 'admin' ? '/adminLogin' : '/login');
        } catch (err) {
            console.error('Logout error:', err);
        }
    };

    const refreshToken = async () => {
        try {
            if (!user) return false;
            
            const userType = user?.type || 'student';
            const response = await fetch(`/api/${userType}/refresh-token`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                await logout();
                return false;
            }

            const data = await response.json();
            if (data.success) {
                return true;
            }
            await logout();
            return false;
        } catch (error) {
            console.error('Token refresh error:', error);
            await logout();
            return false;
        }
    };

    const fetchWithToken = async (url, options = {}) => {
        try {
            options.credentials = 'include';
            options.headers = {
                ...options.headers,
                'Content-Type': 'application/json'
            };

            let response = await fetch(url, options);

            if (response.status === 401) {
                const isRefreshed = await refreshToken();
                
                if (isRefreshed) {
                    response = await fetch(url, options);
                } else {
                    throw new Error('Authentication failed');
                }
            }

            return response;
        } catch (error) {
            console.error('Fetch error:', error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            login, 
            logout, 
            loading, 
            error,
            fetchWithToken,
            isAuthenticated: !!user 
        }}>
            {!loading ? children : null}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === null) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}