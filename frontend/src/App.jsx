// src/App.jsx (COMPLETE EDITED FILE)
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import { useAuth } from './context/AuthContext';

// --- Import Actual Page Components ---
import HomePage from './pages/HomePage'; // Public-facing landing page
import AdminDashboard from './pages/AdminDashboard'; 
import DoctorDashboard from './pages/DoctorDashboard'; 
import ReceptionistDashboard from './pages/ReceptionistDashboard'; 

import PatientManagerPage from './pages/PatientManagerPage'; 
import PatientProfile from './components/PatientProfile';
import AppointmentsPage from './pages/AppointmentsPage'; 
import EmployeeManagerPage from './pages/EmployeeManagerPage';
import BillingManagerPage from './pages/BillingManagerPage';
import RoomManagerPage from './pages/RoomManagerPage';


const App = () => {
    const { user } = useAuth(); 
    
    // Determine the user's role and set the margin for the content area
    // This is applied globally to shift content when the Sidebar is visible.
    const sidebarMargin = user ? '250px' : '0';

    return (
        <div style={{ display: 'flex' }}>
            {/* 1. Sidebar is rendered ONCE if staff user is logged in */}
            {user && <Sidebar />} 
            
            <main style={{ flexGrow: 1, marginLeft: sidebarMargin }}> 
                <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/home" element={<HomePage />} /> {/* Explicit Public Home Page */}

                    {/* --- Protected Routes --- */}
                    
                    {/* ADMIN ONLY ROUTES */}
                    <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
                        <Route path="/admin" element={<AdminDashboard />} />
                        <Route path="/employees" element={<EmployeeManagerPage />} />
                    </Route>

                    {/* DOCTOR ONLY ROUTES */}
                    <Route element={<ProtectedRoute allowedRoles={['Doctor']} />}>
                        <Route path="/doctor" element={<DoctorDashboard />} /> 
                        <Route path="/prescriptions-manager" element={<h2>Prescriptions Manager (Doctor only)</h2>} />
                    </Route>
                    
                    {/* RECEPTIONIST ONLY ROUTES */}
                    <Route element={<ProtectedRoute allowedRoles={['Receptionist']} />}>
                        <Route path="/receptionist" element={<ReceptionistDashboard />} />
                        <Route path="/bills" element={<BillingManagerPage />} />
                        <Route path="/rooms" element={<RoomManagerPage />} />
                    </Route>

                    {/* SHARED ROUTES (Staff Access - All Roles) */}
                    <Route element={<ProtectedRoute allowedRoles={['Doctor', 'Receptionist', 'Admin']} />}>
                        <Route path="/patients" element={<PatientManagerPage />} /> 
                        <Route path="/patients/:id" element={<PatientProfile />} /> 
                        <Route path="/appointments" element={<AppointmentsPage />} /> 
                    </Route>
                    
                    {/* 404 CATCH-ALL (Optional) */}
                    <Route path="*" element={<Navigate to="/" replace />} /> 

                    {/* Default Route: The main routing decision point */}
                    <Route 
                        path="/" 
                        element={
                            user 
                            ? ( // IF staff user is authenticated, redirect to their dashboard
                                user.role === 'Admin' ? <Navigate to="/admin" replace /> : 
                                user.role === 'Doctor' ? <Navigate to="/doctor" replace /> :
                                user.role === 'Receptionist' ? <Navigate to="/receptionist" replace /> : <HomePage />
                              )
                            : ( // ELSE (public visitor), DIRECTLY RENDER the Home Page
                                <HomePage />
                              )
                        }
                    />
                </Routes>
            </main>
        </div>
    );
};

export default App;