// src/pages/AdminDashboard.jsx
import React from 'react';
import StatCard from '../components/StatCard';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    
    // ⚠️ Mock Admin Stats
    const mockStats = [
        { title: 'Total Employees', value: 55, icon: '👥', color: '#8e44ad' },
        { title: 'System Roles Defined', value: 4, icon: '🔑', color: '#2c3e50' },
        { title: 'Current Room Occupancy', value: '75%', icon: '🏥', color: '#16a085' },
    ];

    const handleNavigation = (path) => {
        navigate(path);
    };

    return (
        <div className="admin-dashboard-container" style={{ padding: '20px' }}>
            <h2>Admin Control Panel, {user?.name || 'Admin'}</h2>
            <p style={{ color: '#555', marginBottom: '30px' }}>
                Manage system users, permissions, and resources.
            </p>

            {/* 1. Stat Cards Row */}
            <div className="stat-cards-row" style={{ display: 'flex', gap: '20px', marginBottom: '40px' }}>
                {mockStats.map((stat) => (
                    // Reusing StatCard component
                    <StatCard key={stat.title} title={stat.title} value={stat.value} icon={stat.icon} color={stat.color} />
                ))}
            </div>

            {/* 2. Main Management Links */}
            <div className="management-links">
                <h3>Core Management</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                    <QuickActionButton 
                        label="Manage Employees" 
                        icon="🧑‍💼" 
                        onClick={() => handleNavigation('/employees')} 
                        color="#8e44ad"
                    />
                    <QuickActionButton 
                        label="Define Roles & Access" 
                        icon="🔐" 
                        onClick={() => handleNavigation('/roles')} 
                        color="#2c3e50"
                    />
                    <QuickActionButton 
                        label="Review System Logs" 
                        icon="📜" 
                        onClick={() => alert('Viewing logs...')} 
                        color="#16a085"
                    />
                </div>
            </div>
            
            {/* You can add system settings or charts here later */}
        </div>
    );
};

// Reusing the QuickActionButton component from the Receptionist step
const QuickActionButton = ({ label, icon, onClick, color }) => (
    <button 
        onClick={onClick}
        style={{
            padding: '25px 15px',
            border: `2px solid ${color}`,
            borderRadius: '8px',
            background: color,
            color: 'white',
            fontSize: '1.1em',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'opacity 0.3s',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
        }}
        onMouseEnter={e => e.currentTarget.style.opacity = 0.9}
        onMouseLeave={e => e.currentTarget.style.opacity = 1}
    >
        <span style={{ fontSize: '1.5em', display: 'block', marginBottom: '5px' }}>{icon}</span>
        {label}
    </button>
);

export default AdminDashboard;