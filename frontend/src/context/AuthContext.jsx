import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const initAuth = async () => {
            try {
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    const userSession = JSON.parse(storedUser);
                    const sessionAge = new Date().getTime() - userSession.timestamp;
                    
                    if (sessionAge > 24 * 60 * 60 * 1000) {
                        await logout();
                    } else {
                        const isValid = await refreshToken();
                        if (isValid) {
                            setUser(userSession.data);
                            // Only redirect if on login pages
                            const path = window.location.pathname;
                            if (path === '/login' || path === '/adminLogin') {
                                handleRedirect(userSession.data);
                            }
                        } else {
                            await logout();
                        }
                    }
                }
            } catch (err) {
                console.error('Auth initialization error:', err);
                setError(err.message);
                await logout();
            } finally {
                setLoading(false);
            }
        };
        
        initAuth();
    }, []);

    const handleRedirect = (userData) => {
        if (!userData) return;

        // Admin redirection
        if (userData.type === 'admin') {
            navigate(`/admin/${userData._id}`);
            return;
        }

        // For students and teachers, check document verification first
        if (userData.needsVerification || (!userData.Studentdetails && !userData.Teacherdetails)) {
            const docPath = userData.type === 'student' ? 'StudentDocument' : 'TeacherDocument';
            navigate(`/${docPath}/${userData._id}`);
            return;
        }

        // Check approval status
        if (userData.Isapproved === 'pending') {
            navigate('/pending');
            return;
        }

        if (userData.Isapproved === 'rejected') {
            navigate(`/rejected/${userData._id}/${userData.type}`);
            return;
        }

        // Navigate to dashboard if approved
        const dashboardPath = userData.type === 'student' ? 'search' : 'home';
        navigate(`/dashboard/${userData.type}/${userData._id}/${dashboardPath}`);
    };

    const login = async (userData, userType) => {
        try {
            setLoading(true);
            setError(null);
            
            setUser(userData);
            if (userType === 'teacher') {
                // For teachers, directly navigate to their dashboard
                navigate(`/dashboard/teacher/${userData._id}/home`);
            } else if (userType === 'student') {
                // Keep existing student verification logic
                if (!userData.Isverified) {
                    navigate('/verify-email');
                    return;
                }
                if (!userData.Studentdocs) {
                    navigate(`/StudentDocument/${userData._id}`);
                    return;
                }
                navigate('/student/dashboard');
            }
            
            const userWithType = { ...userData, type: userType };
            setUser(userWithType);
            
            const userSession = {
                data: userWithType,
                timestamp: new Date().getTime()
            };
            localStorage.setItem('user', JSON.stringify(userSession));
            
        } catch (err) {
            console.error('Login error:', err);
            setError(err.message);
            setUser(null);
            localStorage.removeItem('user');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            setLoading(true);
            const userType = user?.type || 'student';
            await fetch(`/api/${userType}/logout`, {
                method: 'POST',
                credentials: 'include'
            });
        } catch (err) {
            console.error('Logout error:', err);
        } finally {
            setUser(null);
            localStorage.removeItem('user');
            setLoading(false);
            navigate(user?.type === 'admin' ? '/adminLogin' : '/login');
        }
    };

    const refreshToken = async () => {
        try {
            if (!user?.type) return false;
            
            const response = await fetch(`/api/${user.type}/refresh-token`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const data = await response.json();
                if (response.status === 401) {
                    await logout();
                }
                return false;
            }

            return true;
        } catch (error) {
            console.error('Token refresh error:', error);
            return false;
        }
    };

    useEffect(() => {
        if (user) {
            const refreshInterval = setInterval(() => {
                refreshToken();
            }, 14 * 60 * 1000); // Refresh every 14 minutes
            
            return () => clearInterval(refreshInterval);
        }
    }, [user]);

    const fetchWithToken = async (url, options = {}) => {
        try {
            const response = await fetch(url, {
                ...options,
                credentials: 'include',
                headers: {
                    ...options.headers,
                    'Content-Type': options.headers?.['Content-Type'] || 'application/json'
                }
            });

            if (response.status === 401) {
                const refreshed = await refreshToken();
                if (refreshed) {
                    return fetch(url, {
                        ...options,
                        credentials: 'include',
                        headers: {
                            ...options.headers,
                            'Content-Type': options.headers?.['Content-Type'] || 'application/json'
                        }
                    });
                }
            }
            return response;
        } catch (error) {
            if (error.message.includes('token') || error.message.toLowerCase().includes('unauthorized')) {
                await refreshToken();
            }
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