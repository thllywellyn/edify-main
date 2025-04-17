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
                }
            }
        } catch (err) {
            console.error('Auth initialization error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    const login = async (userData, userType) => {
        try {
            setLoading(true);
            setError(null);
            const userWithType = { ...userData, type: userType };
            setUser(userWithType);
            const userSession = {
                data: userWithType,
                timestamp: new Date().getTime()
            };
            localStorage.setItem('user', JSON.stringify(userSession));

            // Handle navigation based on user status
            if (userData.status === "pending") {
                if (userData.Teacherdetails || userData.Studentdetails) {
                    navigate('/pending');
                } else {
                    navigate(`/${userType}Document/${userData._id}`);
                }
            } else if (userData.status === "approved") {
                navigate(`/dashboard/${userType}/${userData._id}/${userType === 'student' ? 'search' : 'home'}`);
            } else if (userData.status === "reupload") {
                navigate(`/rejected/${userType}/${userData._id}`);
            }
        } catch (err) {
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
            navigate('/login', { replace: true });
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