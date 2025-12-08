// src/pages/ReceptionistDashboard.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/StatCard';
import DataTable from '../components/DataTable';
import API from '../api/config';

const ReceptionistDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [stats, setStats] = useState({
    totalAppointments: 0,
    patientsCheckedIn: 0,
    availableRooms: 0,
    totalRooms: 0,
    pendingBills: 0,
  });

  const [loadingStats, setLoadingStats] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);

  // -------------------- Fetch Dashboard Stats --------------------
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
        console.error('Failed to fetch stats:', err);
      } finally {
        setLoadingStats(false);
      }
    };
    fetchStats();
  }, []);

  // -------------------- Fetch Today Appointments --------------------
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await API.get('/appointments');
        const today = new Date().toISOString().split('T')[0];

        const todaysAppointments = res.data.filter(a => {
          const apptDate = new Date(a.Date).toISOString().split('T')[0];
          return apptDate === today;
        });

        setAppointments(todaysAppointments);
      } catch (err) {
        console.error('Failed to fetch appointments:', err);
      } finally {
        setLoadingAppointments(false);
      }
    };
    fetchAppointments();
  }, []);

  // -------------------- Table Columns --------------------
  const appointmentColumns = [
    { header: 'Time', accessor: 'Time' },
    { header: 'Patient', accessor: 'Patient_Name' },
    { header: 'Doctor', accessor: 'Doctor_Name' },
    { header: 'Reason', accessor: 'Reason' },
  ];

  // -------------------- Table Action Buttons --------------------
  const appointmentActions = [
    {
      label: 'Check-In',
      handler: (row) => alert(`Checking in ${row.Patient_Name}`),
      style: "bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-sm"
    },
    {
      label: 'View Patient',
      handler: (row) => navigate(`/patients/${row.Patient_ID}`),
      style: "bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm"
    },
  ];

  // -------------------- Room Progress Bar --------------------
  const RoomProgress = () => {
    const occupied = stats.totalRooms - stats.availableRooms;
    const percentage = stats.totalRooms
      ? Math.round((occupied / stats.totalRooms) * 100)
      : 0;

    return (
      <div className="mt-2 w-full bg-gray-200 rounded-full h-4 overflow-hidden relative">
        <div
          className="h-4 bg-yellow-500 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
        <span className="absolute top-0 left-1/2 -translate-x-1/2 text-xs text-gray-700 font-semibold">
          {percentage}%
        </span>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-8">
      <h2 className="text-3xl font-bold text-gray-800">
        Hello, {user?.name || 'Receptionist'}!
      </h2>
      <p className="text-gray-600">Your operational dashboard for patient management and scheduling.</p>

      {/* -------------------- Stats Section -------------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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

      {/* -------------------- Quick Action Buttons -------------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <QuickActionButton
          label="Register Patient"
          icon="➕"
          onClick={() => navigate('/patients/new')}
        />

        {/* ⭐ NEW: ROOM MANAGEMENT BUTTON (Copied from Admin Dashboard UI flow) */}
        <QuickActionButton
          label="Room Management"
          icon="🛏️"
          onClick={() => navigate('/rooms')}
        />
      </div>

      {/* -------------------- Today Appointments -------------------- */}
      <div className="overflow-x-auto">
        <h3 className="text-2xl font-semibold mb-3 text-center">Today's Clinic Agenda</h3>

        {loadingAppointments ? (
          <p className="text-gray-500">Loading appointments...</p>
        ) : appointments.length === 0 ? (
          <p className="text-gray-500 text-center">No appointments for today.</p>
        ) : (
          <DataTable
            title="Appointments Requiring Action"
            columns={appointmentColumns}
            data={appointments}
            actions={appointmentActions}
          />
        )}
      </div>
    </div>
  );
};

// -------------------- Quick Action Button Component --------------------
const QuickActionButton = ({ label, icon, onClick }) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center justify-center p-6 
    bg-gradient-to-r from-indigo-500 to-purple-500 text-white 
    rounded-xl shadow-lg hover:scale-105 transform transition 
    duration-300 h-full"
  >
    <span className="text-4xl mb-2">{icon}</span>
    <span className="font-semibold text-center">{label}</span>
  </button>
);

export default ReceptionistDashboard;
