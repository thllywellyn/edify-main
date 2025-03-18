import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the AuthContext
const AuthContext = createContext(null);

// AuthProvider component
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    // Login function
    const login = (userData) => {
        setUser(userData);
        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify(userData));
    };

    // Logout function
    const logout = () => {
        setUser(null);
        // Remove user data from localStorage
        localStorage.removeItem('user');
    };

    // Check for existing user on mount
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

// Custom hook to use the AuthContext
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === null) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}