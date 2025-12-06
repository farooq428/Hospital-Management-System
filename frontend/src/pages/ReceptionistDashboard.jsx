import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/StatCard';
import DataTable from '../components/DataTable';
import API from '../api/config';

const ReceptionistDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Dashboard stats
  const [stats, setStats] = useState({
    totalAppointments: 0,
    patientsCheckedIn: 0,
    availableRooms: 0,
    totalRooms: 0,
    pendingBills: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [appointmentsRes, dashboardRes] = await Promise.all([
          API.get('/appointments/total'),
          API.get('/dashboard/receptionist')
        ]);

        setStats({
          totalAppointments: appointmentsRes.data.totalAppointments || 0,
          patientsCheckedIn: dashboardRes.data.patientsCheckedIn || 0,
          availableRooms: dashboardRes.data.availableRooms || 0,
          totalRooms: dashboardRes.data.totalRooms || 0,
          pendingBills: dashboardRes.data.pendingBills || 0,
        });
      } catch (err) {
        console.error('Failed to fetch dashboard stats:', err);
      } finally {
        setLoadingStats(false);
      }
    };
    fetchStats();
  }, []);

  // Fetch today's appointments for table
  const [appointments, setAppointments] = useState([]);
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await API.get('/appointments');
        const today = new Date().toISOString().split('T')[0];
        const todaysAppointments = res.data.filter(a => a.Date === today);
        setAppointments(todaysAppointments);
      } catch (err) {
        console.error('Failed to fetch appointments:', err);
      }
    };
    fetchAppointments();
  }, []);

  const appointmentColumns = [
    { header: 'Time', accessor: 'Time' },
    { header: 'Patient', accessor: 'Patient_Name' },
    { header: 'Doctor', accessor: 'Doctor_Name' },
    { header: 'Reason', accessor: 'Reason' },
  ];

  const appointmentActions = [
    {
      label: 'Check-In',
      handler: (row) => alert(`Checking in ${row.Patient_Name}`),
      style: { background: '#2ecc71', color: 'white', borderRadius: '4px', border: 'none' },
    },
    {
      label: 'View Patient',
      handler: (row) => navigate(`/patients/${row.Patient_ID}`),
      style: { background: '#3498db', color: 'white', borderRadius: '4px', border: 'none' },
    },
  ];

  // Room progress bar
  const RoomProgress = () => {
    const occupied = stats.totalRooms - stats.availableRooms;
    const percentage = stats.totalRooms ? Math.round((occupied / stats.totalRooms) * 100) : 0;
    return (
      <div className="mt-2 w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          className="h-2 bg-yellow-500 rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
    );
  };

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        Hello, {user?.name || 'Receptionist'}!
      </h2>
      <p className="text-gray-600 mb-6">Your operational dashboard for patient management and scheduling.</p>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Appointments"
          value={loadingStats ? '...' : stats.totalAppointments}
          icon="📅"
          color="blue"
        />
        <StatCard
          title="Patients Checked-In"
          value={loadingStats ? '...' : stats.patientsCheckedIn}
          icon="✅"
          color="green"
        />
        <StatCard
          title={`Available Rooms (${stats.availableRooms}/${stats.totalRooms})`}
          value={loadingStats ? '...' : stats.availableRooms}
          icon="🛌"
          color="yellow"
          extra={<RoomProgress />}
        />
        <StatCard
          title="Pending Bills"
          value={loadingStats ? '...' : stats.pendingBills}
          icon="💳"
          color="red"
        />
      </div>

      {/* Quick Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <QuickActionButton label="Register Patient" icon="➕" onClick={() => navigate('/patients/new')} />
        <QuickActionButton label="Book Appointment" icon="🗓️" onClick={() => navigate('/appointments/new')} />
        <QuickActionButton label="Generate Bill" icon="💳" onClick={() => navigate('/receptionist/bills')} />
      </div>

      {/* Today's Appointments Table */}
      <div className="overflow-x-auto">
        <h3 className="text-xl font-semibold mb-2">Today's Clinic Agenda</h3>
        <DataTable
          title="Appointments Requiring Action"
          columns={appointmentColumns}
          data={appointments}
          actions={appointmentActions}
        />
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
