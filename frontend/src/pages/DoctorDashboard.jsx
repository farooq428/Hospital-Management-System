// src/pages/DoctorDashboard.jsx
import React from 'react';
import Sidebar from '../components/Sidebar'; // Assuming you import Sidebar in App.jsx and it controls layout
import AppointmentCalendar from '../components/AppointmentCalendar';
import StatCard from '../components/StatCard';
import { useAuth } from '../context/AuthContext'; // To personalize the greeting

const DoctorDashboard = () => {
    const { user } = useAuth();
    
    // ⚠️ Mock data for display before backend is ready
    const mockStats = [
        { title: 'Today\'s Appointments', value: 12, icon: '🗓️' },
        { title: 'New Patient Consults', value: 3, icon: '✨' },
        { title: 'Pending Prescriptions', value: 5, icon: '💊' },
    ];

    return (
        <div className="doctor-dashboard-container" style={{ padding: '20px' }}>
            <h2>Welcome Back, Dr. {user?.name || 'Doctor'}!</h2>
            <p style={{ color: '#555', marginBottom: '30px' }}>
                Quick overview of your day and upcoming schedule.
            </p>

            {/* 1. Stat Cards Section */}
            <div className="stat-cards-row" style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
                {mockStats.map((stat) => (
                    <StatCard key={stat.title} title={stat.title} value={stat.value} icon={stat.icon} />
                    // Note: You need to implement the StatCard component
                ))}
            </div>

            {/* 2. Main Appointment Calendar */}
            <div className="schedule-section">
                <h3>My Current Schedule</h3>
                <AppointmentCalendar doctorId={user?.id || 1} /> 
            </div>

            {/* Optional: Quick Patient Search */}
            <div className="quick-search-section" style={{ marginTop: '30px' }}>
                {/* Search component for quick patient lookup before consultation */}
            </div>
        </div>
    );
};

export default DoctorDashboard;