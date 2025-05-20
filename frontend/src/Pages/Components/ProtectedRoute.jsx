import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ children }) {
    const { user, isAuthenticated } = useAuth();
    const location = useLocation();
    
    // Check if this is an admin route
    const isAdminRoute = location.pathname.startsWith('/admin');

    if (!isAuthenticated || !user) {
        // Redirect to appropriate login page based on route type
        const loginPath = isAdminRoute ? '/adminLogin' : '/login';
        return <Navigate to={loginPath} state={{ from: location }} replace />;
    }

    // For admin routes, ensure the user is actually an admin
    if (isAdminRoute && user.type !== 'admin') {
        return <Navigate to="/login" replace />;
    }

    return children;
}