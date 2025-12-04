import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/config';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for automatic redirection

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// Helper function to derive a display name from the stored email
const getUserDetails = (role, email) => {
    return { 
        name: email ? email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1) : role,
        role 
    };
};

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        const role = localStorage.getItem('userRole');
        const email = localStorage.getItem('userEmail'); 

        if (token && role) {
            setUser(getUserDetails(role, email));
            setIsAuthenticated(true);
        }
    }, []);

    const login = async (email, password) => {
        try {
            const response = await API.post('/auth/login', { email, password });
            
            const { token, role, employeeId } = response.data; // Backend should return employeeId

            localStorage.setItem('jwtToken', token);
            localStorage.setItem('userRole', role);
            localStorage.setItem('userEmail', email); 
            localStorage.setItem('employeeId', employeeId); // Store ID for doctor-specific queries

            setUser(getUserDetails(role, email));
            setIsAuthenticated(true);
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
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};