import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const login = (email, password) => {
        // Mock login logic
        const users = {
            'admin@easycare.com': { role: 'Admin', password: 'admin123' },
            'reception@easycare.com': { role: 'Receptionist', password: 'reception123' },
            'system@easycare.com': { role: 'Doctor', password: 'doctor123' }
        };

        if (users[email] && users[email].password === password) {
            setUser({ email, role: users[email].role });
            return true;
        }
        return false;
    };

    const getRole = () => user?.role;

    const logout = () => setUser(null);

    return (
        <AuthContext.Provider value={{ login, getRole, logout, user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};