// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import { useAuth } from './context/AuthContext';

// ⚠️ Placeholder Components for the Dashboards/Pages
const AdminDashboard = () => <div><Sidebar /><h1>Admin Dashboard</h1></div>;
const DoctorDashboard = () => <div><Sidebar /><h1>Doctor Dashboard (Appointments View)</h1></div>;
const ReceptionistDashboard = () => <div><Sidebar /><h1>Receptionist Dashboard (Quick Actions)</h1></div>;
const PatientProfile = () => <div><Sidebar /><h1>Patient Profile View</h1></div>;
const AppointmentsPage = () => <div><Sidebar /><h1>Appointment Manager</h1></div>;

const App = () => {
    const { user } = useAuth(); // Use context to check if logged in

    return (
        <div style={{ display: 'flex' }}>
            {/* The Sidebar will only render if the user object is not null */}
            {user && <Sidebar />} 
            
            {/* Main Content Area: Adjust margin/width if Sidebar is fixed */}
            <main style={{ flexGrow: 1, marginLeft: user ? '250px' : '0' }}> 
                <Routes>
                    {/* Public Route */}
                    <Route path="/login" element={<LoginPage />} />

                    {/* --- Protected Routes --- */}
                    <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
                        <Route path="/admin" element={<AdminDashboard />} />
                        <Route path="/employees" element={<div><Sidebar /><h2>Employee Management (Admin only)</h2></div>} />
                    </Route>

                    <Route element={<ProtectedRoute allowedRoles={['Doctor']} />}>
                        <Route path="/doctor" element={<DoctorDashboard />} />
                        <Route path="/prescriptions" element={<div><Sidebar /><h2>Prescriptions Manager (Doctor only)</h2></div>} />
                    </Route>
                    
                    <Route element={<ProtectedRoute allowedRoles={['Receptionist']} />}>
                        <Route path="/receptionist" element={<ReceptionistDashboard />} />
                        <Route path="/bills" element={<div><Sidebar /><h2>Billing Manager (Receptionist only)</h2></div>} />
                        <Route path="/rooms" element={<div><Sidebar /><h2>Room Assignment (Receptionist only)</h2></div>} />
                    </Route>

                    {/* Shared Routes */}
                    <Route element={<ProtectedRoute allowedRoles={['Doctor', 'Receptionist']} />}>
                        <Route path="/patients/:id" element={<PatientProfile />} />
                        <Route path="/appointments" element={<AppointmentsPage />} />
                    </Route>

                    {/* Default Route: Redirect to dashboard if logged in, or login if not */}
                    <Route 
                        path="/" 
                        element={
                            user 
                            ? (user.role === 'Admin' ? <Navigate to="/admin" /> : 
                               user.role === 'Doctor' ? <Navigate to="/doctor" /> :
                               user.role === 'Receptionist' ? <Navigate to="/receptionist" /> : <Navigate to="/login" />
                              )
                            : <Navigate to="/login" />
                        }
                    />
                </Routes>
            </main>
        </div>
    );
};

export default App;