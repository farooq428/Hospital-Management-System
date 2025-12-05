import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/config';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

// Helper function to derive display name
const getUserDetails = (role, email) => ({
    name: email ? email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1) : role,
    role
});

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    // On mount: check localStorage and redirect if logged in
    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        const role = localStorage.getItem('userRole');
        const email = localStorage.getItem('userEmail');

        if (token && role) {
            const currentUser = getUserDetails(role, email);
            setUser(currentUser);
            setIsAuthenticated(true);

            // Redirect to dashboard based on role
            if (window.location.pathname === '/login' || window.location.pathname === '/') {
                if (role === 'Admin') navigate('/admin', { replace: true });
                else if (role === 'Doctor') navigate('/doctor', { replace: true });
                else if (role === 'Receptionist') navigate('/receptionist', { replace: true });
            }
        }
    }, [navigate]);

    const login = async (email, password) => {
        try {
            const response = await API.post('/auth/login', { email, password });
            const { token, role, employeeId } = response.data;

            localStorage.setItem('jwtToken', token);
            localStorage.setItem('userRole', role);
            localStorage.setItem('userEmail', email);
            localStorage.setItem('employeeId', employeeId);

            const currentUser = getUserDetails(role, email);
            setUser(currentUser);
            setIsAuthenticated(true);

            // Redirect immediately after login
            if (role === 'Admin') navigate('/admin', { replace: true });
            else if (role === 'Doctor') navigate('/doctor', { replace: true });
            else if (role === 'Receptionist') navigate('/receptionist', { replace: true });

            return true;
        } catch (error) {
            console.error('Login failed:', error.response?.data?.message || error.message);
            return error.response?.data?.message || 'Login failed. Check server status.';
        }
    };

    const logout = () => {
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('employeeId');
        setUser(null);
        setIsAuthenticated(false);
        navigate('/login', { replace: true });
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
