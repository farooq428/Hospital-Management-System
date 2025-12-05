import React, { useState, useEffect } from 'react';
import StatCard from '../components/StatCard';
import DataTable from '../components/DataTable';
import { useAuth } from '../context/AuthContext';
import API from '../api/config';

const DoctorDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await API.get('/dashboard/doctor');
                setStats(res.data);
            } catch (err) {
                console.error('Failed to fetch doctor stats:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <p className="p-6">Loading dashboard stats...</p>;

    const appointmentColumns = [
        { header: 'Time', accessor: 'Time' },
        { header: 'Patient Name', accessor: 'Patient_Name' },
        { header: 'Reason', accessor: 'Reason' },
    ];

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-2">🩺 Welcome Back, Dr. {user?.name}</h2>
            <p className="text-gray-600 mb-6">Your agenda and clinical resources are below.</p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
                <StatCard title="Today's Appointments" value={stats.todayAppointments.length} icon="📅" color="#3498db" />
                <StatCard title="Total Patients Under Care" value={stats.totalPatients} icon="👤" color="#2ecc71" />
                <StatCard title="Pending Test Reviews" value={stats.pendingReports} icon="🔬" color="#f39c12" />
            </div>

            <div>
                <h3 className="text-xl font-semibold mb-2">Today's Agenda</h3>
                <DataTable
                    title={`Appointments (${stats.todayAppointments.length})`}
                    columns={appointmentColumns}
                    data={stats.todayAppointments}
                    actions={[
                        {
                            label: 'Start Consultation',
                            handler: (row) => alert(`Starting consultation with ${row.Patient_Name}`),
                            style: { background: '#2ecc71', color: 'white' }
                        }
                    ]}
                />
            </div>
        </div>
    );
};

export default DoctorDashboard;
