import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/StatCard';
import DataTable from '../components/DataTable';
import API from '../api/config'; // <-- Import API

const ReceptionistDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [stats, setStats] = useState({
    appointmentsToday: 0,
    patientsCheckedIn: 0,
    availableRooms: 0,
    pendingBills: 0,
  });

  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get('/dashboard/receptionist');
        setStats(res.data);
      } catch (err) {
        console.error('Failed to fetch dashboard stats:', err);
      } finally {
        setLoadingStats(false);
      }
    };
    fetchStats();
  }, []);

  const mockAppointments = [
    { id: 201, time: '10:00 AM', patientName: 'Arthur Dent', doctorName: 'Dr. Zaphod', status: 'Pending Check-in', patientId: 1004 },
    { id: 202, time: '10:15 AM', patientName: 'Trillian Astra', doctorName: 'Dr. Ford', status: 'Checked-In', patientId: 1005 },
    { id: 203, time: '10:30 AM', patientName: 'Marvin Android', doctorName: 'Dr. Zaphod', status: 'Pending Check-in', patientId: 1006 },
  ];

  const appointmentColumns = [
    { header: 'Time', accessor: 'time' },
    { header: 'Patient', accessor: 'patientName' },
    { header: 'Doctor', accessor: 'doctorName' },
    { header: 'Status', accessor: 'status' },
  ];

  const appointmentActions = [
    {
      label: 'Check-In',
      handler: (row) => alert(`Checking in ${row.patientName}`),
      style: { background: '#2ecc71', color: 'white', borderRadius: '4px', border: 'none' },
    },
    {
      label: 'View Patient',
      handler: (row) => navigate(`/patients/${row.patientId}`),
      style: { background: '#3498db', color: 'white', borderRadius: '4px', border: 'none' },
    },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Hello, {user?.name || 'Receptionist'}!</h2>
      <p className="text-gray-600 mb-6">Your operational dashboard for patient management and scheduling.</p>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Appointments Today" value={loadingStats ? '...' : stats.appointmentsToday} icon="🗓️" color="blue" />
        <StatCard title="Patients Checked-In" value={loadingStats ? '...' : stats.patientsCheckedIn} icon="✅" color="green" />
        <StatCard title="Available Rooms" value={loadingStats ? '...' : stats.availableRooms} icon="🛌" color="yellow" />
        <StatCard title="Pending Bills" value={loadingStats ? '...' : stats.pendingBills} icon="💳" color="red" />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <QuickActionButton label="Register Patient" icon="➕" onClick={() => navigate('/patients/new')} />
        <QuickActionButton label="Book Appointment" icon="🗓️" onClick={() => navigate('/appointments/new')} />
        <QuickActionButton label="Generate Bill" icon="💳" onClick={() => navigate('/bills/new')} />
        <QuickActionButton label="Manage Rooms" icon="🛌" onClick={() => navigate('/rooms')} />
      </div>

      {/* Today's Appointments */}
      <div>
        <h3 className="text-xl font-semibold mb-2">Today's Clinic Agenda</h3>
        <DataTable title="Appointments Requiring Action" columns={appointmentColumns} data={mockAppointments} actions={appointmentActions} />
      </div>
    </div>
  );
};

const QuickActionButton = ({ label, icon, onClick }) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center justify-center p-5 bg-gray-100 rounded-lg shadow hover:bg-gray-200 transition duration-200"
  >
    <span className="text-3xl mb-2">{icon}</span>
    <span className="font-semibold text-gray-800 text-center">{label}</span>
  </button>
);

export default ReceptionistDashboard;
