// src/pages/DoctorDashboard.jsx (COMPLETE FILE)
import React, { useState, useEffect } from 'react';
import StatCard from '../components/StatCard';
import DataTable from '../components/DataTable';
import { useAuth } from '../context/AuthContext.jsx';
import API from '../api/config'; // <-- API Import

const DoctorDashboard = () => {
    const { user } = useAuth();
    const employeeId = localStorage.getItem('employeeId'); // Get doctor's ID
    const [todayAppointments, setTodayAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    const today = new Date().toISOString().split('T')[0];

    useEffect(() => {
        const fetchDoctorAppointments = async () => {
            if (!employeeId) return;
            try {
                // Fetch appointments for today for the logged-in doctor
                const response = await API.get(`/appointments/doctor/${employeeId}?date=${today}`);
                setTodayAppointments(response.data);
            } catch (error) {
                console.error('Failed to fetch appointments:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDoctorAppointments();
    }, [employeeId, today]);

    const appointmentColumns = [
        { header: 'Time', accessor: 'Time' },
        { header: 'Patient Name', accessor: 'Patient_Name' },
        { header: 'Reason', accessor: 'Reason' },
    ];

    return (
        <div className="doctor-dashboard-container" style={{ padding: '20px' }}>
            <h2>🩺 Welcome Back, Dr. {user?.name || 'Doctor'}</h2>
            <p style={{ color: '#555', marginBottom: '30px' }}>Your agenda and clinical resources are below.</p>

            <div className="stat-cards-row" style={{ display: 'flex', gap: '20px', marginBottom: '40px' }}>
                <StatCard title="Today's Appointments" value={todayAppointments.length} icon="📅" color="#3498db" />
                <StatCard title="Total Patients Under Care" value={150} icon="👤" color="#2ecc71" />
                <StatCard title="Pending Test Reviews" value={7} icon="🔬" color="#f39c12" />
            </div>

            <div className="today-agenda-section">
                <h3>Today's Agenda ({today})</h3>
                {loading ? (
                    <p>Loading today's appointments...</p>
                ) : (
                    <DataTable
                        title={`Appointments (${todayAppointments.length})`}
                        columns={appointmentColumns}
                        data={todayAppointments} // <-- Using real data
                        actions={[{ label: 'Start Consultation', handler: (row) => alert(`Starting consultation with ${row.Patient_Name}`), style: { background: '#2ecc71', color: 'white' } }]}
                    />
                )}
            </div>
        </div>
    );
};

export default DoctorDashboard;