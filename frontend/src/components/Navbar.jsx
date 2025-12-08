import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Ensure this path is correct

const Navbar = () => {
    // Access the user and the logout function from context
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    // Placeholder navigation links based on typical user roles
    const navLinks = [
        { path: "/dashboard", label: "Dashboard", role: ["Doctor", "Admin"] },
        { path: "/patients", label: "Patients", role: ["Doctor", "Admin"] },
        { path: "/appointments", label: "Appointments", role: ["Doctor", "Admin"] },
        // Add more links as needed for Admin/Receptionist roles
    ];

    // Filter links based on the authenticated user's role
    const filteredLinks = navLinks.filter(link => 
        user && link.role.includes(user.role) // Links only show if 'user' is present
    );
    
    // Check if the user is authenticated (used for conditional rendering)
    const isAuthenticated = !!user;

    return (
        <nav className="bg-teal-700 shadow-md sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    
                    {/* Brand/Logo */}
                    {/* Link to dashboard if logged in, otherwise default to a non-functional link or the homepage */}
                    <Link to={isAuthenticated ? "/dashboard" : "/"} 
                          className="flex-shrink-0 text-white text-xl font-extrabold tracking-wide">
                        EasyCare Hospital System
                    </Link>

                    {/* Navigation Links (Show only when authenticated) */}
                    {isAuthenticated && (
                        <div className="hidden md:flex md:space-x-4 ml-6">
                            {filteredLinks.map(link => (
                                <Link 
                                    key={link.path}
                                    to={link.path}
                                    className="text-teal-100 hover:bg-teal-600 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition duration-150"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* User Info and Logout Button (Show only when authenticated) */}
                    {isAuthenticated && (
                        <div className="flex items-center space-x-4">
                            <span className="text-teal-100 text-sm hidden sm:inline">
                                Logged in as: 
                                <strong className="ml-1">{user.name || user.Employee_ID} ({user.role})</strong>
                            </span>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500 text-white text-sm font-medium rounded-md shadow-lg hover:bg-red-600 transition duration-150"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3v-4a3 3 0 013-3h7" />
                                </svg>
                                Log Out
                            </button>
                        </div>
                    )}
                    
                    {/* Fallback for unauthenticated users (e.g., login link or spacer) */}
                    {!isAuthenticated && (
                        <Link to="/login" className="px-3 py-1.5 bg-teal-600 text-white text-sm font-medium rounded-md hover:bg-teal-500 transition duration-150">
                            Login
                        </Link>
                    )}

                </div>
            </div>
        </nav>
    );
};

export default Navbar;