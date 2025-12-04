// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const ProtectedRoute = ({ allowedRoles }) => {
    const { user } = useAuth();
    const userRole = user?.role;

    // 1. Check if user is logged in
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // 2. Check if the user's role is allowed for this route
    if (allowedRoles && !allowedRoles.includes(userRole)) {
        // Redirect unauthorized users to their own dashboard or an access denied page
        const redirectPath = userRole === 'Admin' ? '/admin' : 
                             userRole === 'Doctor' ? '/doctor' : 
                             userRole === 'Receptionist' ? '/receptionist' : '/login';
        
        return <Navigate to={redirectPath} replace />;
    }

    // 3. User is authorized, render the content
    return <Outlet />; 
};

export default ProtectedRoute;