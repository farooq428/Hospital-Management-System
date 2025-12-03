// src/pages/ReceptionistDashboard.jsx
import React from 'react';
import StatCard from '../components/StatCard';
import DataTable from '../components/DataTable';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 

const ReceptionistDashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    
    // ⚠️ Mock Stats for Receptionist
    const mockStats = [
        { title: 'Appointments Today', value: 35, icon: '🗓️', color: '#3498db' },
        { title: 'Patients Checked-In', value: 18, icon: '✅', color: '#2ecc71' },
        { title: 'Available Rooms', value: 15, icon: '🛌', color: '#f1c40f' },
        { title: 'Pending Bills', value: 5, icon: '💳', color: '#e74c3c' },
    ];

    // ⚠️ Mock Appointment Data (Similar to Doctor's, but focused on check-in status)
    const todayAppointments = [
        { id: 201, time: '10:00 AM', patientName: 'Arthur Dent', doctorName: 'Dr. Zaphod', status: 'Pending Check-in', patientId: 1004 },
        { id: 202, time: '10:15 AM', patientName: 'Trillian Astra', doctorName: 'Dr. Ford', status: 'Checked-In', patientId: 1005 },
        { id: 203, time: '10:30 AM', patientName: 'Marvin Android', doctorName: 'Dr. Zaphod', status: 'Pending Check-in', patientId: 1006 },
    ];
    
    // DataTable Columns for Today's Appointments
    const appointmentColumns = [
        { header: 'Time', accessor: 'time' },
        { header: 'Patient', accessor: 'patientName' },
        { header: 'Doctor', accessor: 'doctorName' },
        { header: 'Status', accessor: 'status' },
    ];
    
    // DataTable Actions for Appointments
    const appointmentActions = [
        { 
            label: 'Check-In', 
            handler: (row) => alert(`Checking in ${row.patientName}`),
            style: { background: '#2ecc71', color: 'white', border: 'none', borderRadius: '4px' } 
        },
        { 
            label: 'View Patient', 
            handler: (row) => navigate(`/patients/${row.patientId}`),
            style: { background: '#3498db', color: 'white', border: 'none', borderRadius: '4px' } 
        },
    ];

    return (
        <div className="receptionist-dashboard-container" style={{ padding: '20px' }}>
            <h2>Hello, {user?.name || 'Receptionist'}!</h2>
            <p style={{ color: '#555', marginBottom: '30px' }}>
                Your operational dashboard for patient management and scheduling.
            </p>

            {/* 1. Stat Cards Row */}
            <div className="stat-cards-row" style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
                {mockStats.map((stat) => (
                    // Reusing the StatCard, passing color for dynamic style
                    <StatCard key={stat.title} title={stat.title} value={stat.value} icon={stat.icon} color={stat.color} />
                ))}
            </div>

            {/* 2. Quick Actions Section */}
            <div className="quick-actions-row" style={{ display: 'flex', gap: '20px', marginBottom: '40px' }}>
                <QuickActionButton label="Register Patient" icon="➕" onClick={() => navigate('/patients/new')} />
                <QuickActionButton label="Book Appointment" icon="🗓️" onClick={() => navigate('/appointments/new')} />
                <QuickActionButton label="Generate Bill" icon="💳" onClick={() => navigate('/bills/new')} />
                <QuickActionButton label="Manage Rooms" icon="🛌" onClick={() => navigate('/rooms')} />
            </div>

            {/* 3. Today's Appointments Table */}
            <div className="agenda-section">
                <h3>Today's Clinic Agenda</h3>
                <DataTable
                    columns={appointmentColumns}
                    data={todayAppointments}
                    actions={appointmentActions}
                    title="Appointments Requiring Action"
                />
            </div>
        </div>
    );
};

// Simple reusable button for quick actions
const QuickActionButton = ({ label, icon, onClick }) => (
    <button 
        onClick={onClick}
        style={{
            flex: 1,
            padding: '25px 15px',
            border: 'none',
            borderRadius: '8px',
            background: '#ecf0f1',
            color: '#2c3e50',
            fontSize: '1.1em',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'background 0.3s',
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
        }}
        onMouseEnter={e => e.currentTarget.style.background = '#bdc3c7'}
        onMouseLeave={e => e.currentTarget.style.background = '#ecf0f1'}
    >
        <span style={{ fontSize: '1.5em', display: 'block', marginBottom: '5px' }}>{icon}</span>
        {label}
    </button>
);

export default ReceptionistDashboard;