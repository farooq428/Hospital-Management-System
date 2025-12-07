// src/pages/DoctorDashboard.jsx

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import StatCard from '../components/StatCard';
import DataTable from '../components/DataTable';
import { useAuth } from '../context/AuthContext';
import API from '../api/config';
import { useNavigate } from 'react-router-dom';

const DoctorDashboard = () => {
  const { user, isAuthLoading } = useAuth(); 
  const navigate = useNavigate();
  
  // Doctor ID is read for actions, but expected to be handled by the backend's token verification for the GET calls
  const doctorId = user?.Employee_ID; 
  const token = localStorage.getItem("jwtToken"); 

  const [stats, setStats] = useState(null);
  const [appointments, setAppointments] = useState([]); 
  const [loading, setLoading] = useState(true);

  // --- API FETCH FUNCTION (Using paths from your provided routes) ---
  const fetchDashboardData = useCallback(async () => {
    if (isAuthLoading) {
      setLoading(true);
      return; 
    }
    
    // We assume the backend reads the ID from the JWT token for both paths.
    if (!doctorId) {
        setLoading(false);
        console.warn("Doctor ID is missing from user context after auth load.");
        return;
    }

    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      // 1. STATS: Using the path defined in your router: GET /doctor
      const statsRes = await API.get('/doctor', config); 
      
      // 2. APPOINTMENTS: Using a logical path for all appointments, since /appointments?doctorId=x failed.
      // ⚠️ YOU MUST ENSURE THIS ROUTE EXISTS ON THE BACKEND AND READS THE ID FROM THE TOKEN
      const apptsRes = await API.get('/appointments/doctor', config); 

      setStats(statsRes.data);
      setAppointments(apptsRes.data);

    } catch (err) {
      console.error('Failed to fetch doctor dashboard data:', err);
      // Log the specific endpoint error for troubleshooting
      console.error('API Error Details:', err.response?.data || err.message); 
    } finally {
      setLoading(false);
    }
  }, [isAuthLoading, doctorId, token]); 

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData, isAuthLoading]);
  
  // --- APPOINTMENT ACTIONS ---
  const handleCheckPatient = async (appointment) => {
    const isConfirmed = window.confirm(
      `Mark appointment with ${appointment.Patient_Name} as Checked?`
    );

    if (isConfirmed) {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        await API.put(
          // Example: PUT /appointments/123/status
          `/appointments/${appointment.Appointment_ID}/status`, 
          { Status: 'Checked' }, 
          config
        );

        setAppointments((prev) => 
          prev.map((appt) => 
            appt.Appointment_ID === appointment.Appointment_ID ? { ...appt, Status: 'Checked' } : appt
          )
        );
        alert('Patient checked in successfully!');

      } catch (err) {
        console.error('Failed to update appointment status:', err);
        alert('Failed to mark patient as checked.');
      }
    }
  };

  const handleStartConsultation = (row) => {
    navigate(`/patient/${row.Patient_ID}`); 
  };


  // --- DATA FILTERING AND MEMOIZATION ---
  const todayAppointments = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return appointments.filter(
      (appt) => appt.Date === today && appt.Status === 'Scheduled'
    );
  }, [appointments]);

  const allUpcomingAndHandledAppointments = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return appointments
      .filter((appt) => appt.Date !== today || appt.Status !== 'Scheduled')
      .sort((a, b) => new Date(a.Date) - new Date(b.Date) || a.Time.localeCompare(b.Time));
  }, [appointments]);

  // --- COLUMN DEFINITIONS ---
  const todayAppointmentColumns = [
    { header: 'Time', accessor: 'Time' },
    { header: 'Patient Name', accessor: 'Patient_Name' }, 
    { header: 'Reason', accessor: 'Reason' },
    { header: 'Status', accessor: 'Status' },
  ];
  
  const allAppointmentColumns = [
    { header: 'Date', accessor: 'Date' },
    { header: 'Time', accessor: 'Time' },
    { header: 'Patient Name', accessor: 'Patient_Name' }, 
    { header: 'Status', accessor: 'Status' },
  ];


  // --- RENDER LOGIC ---
  if (isAuthLoading) return <p className="p-6 text-center text-gray-500">Initializing User Session...</p>;

  if (loading) return <div className="p-6 text-center text-blue-600"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 inline-block mr-2"></div>Loading dashboard stats...</div>;
  
  if (!stats && appointments.length === 0) return <p className="p-6 text-red-500">❌ Could not load dashboard data. Check API endpoints or network connection.</p>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-extrabold text-gray-800 mb-2">
        🩺 Welcome Back, Dr. {user?.Name || user?.name || 'Doctor'}
      </h2>
      <p className="text-gray-500 mb-6">
        Your agenda and clinical resources are below.
      </p>

      {/* --- STAT CARDS SECTION --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Today's Scheduled"
          value={todayAppointments.length}
          icon="📅"
          color="#3498db"
        />

        <StatCard
          title="Total Patients Under Care"
          value={stats?.totalPatients || 0} 
          icon="👤"
          color="#2ecc71"
        />

        <StatCard
          title="Pending Test Reviews"
          value={stats?.pendingReports || 0}
          icon="🔬"
          color="#f39c12"
        />
      </div>

      <hr className="mb-8 border-gray-200" />

      {/* --- TODAY'S APPOINTMENTS SECTION (Actionable) --- */}
      <div className="mb-10">
        <h3 className="text-2xl font-semibold mb-4 text-blue-700">Today's Agenda: Scheduled Consultations</h3>
        <DataTable
          title={`Appointments Pending Check-in (${todayAppointments.length})`}
          columns={todayAppointmentColumns}
          data={todayAppointments}
          actions={[
            {
              label: 'Check Patient',
              handler: handleCheckPatient,
              style: { background: '#27ae60', color: 'white', borderRadius: '4px' },
              tooltip: "Mark patient as arrived and ready for consultation.",
            },
            {
              label: 'Start Consultation',
              handler: handleStartConsultation,
              style: { background: '#3498db', color: 'white', borderRadius: '4px' },
              tooltip: "Go to patient's profile to view history/prescribe.",
            },
          ]}
        />
      </div>
      
      {/* --- ALL APPOINTMENTS SECTION (Full History/Upcoming) --- */}
      <div>
        <h3 className="text-2xl font-semibold mb-4 text-gray-700">Full Appointment History ({appointments.length})</h3>
        <DataTable
          title={`All Appointments (${allUpcomingAndHandledAppointments.length})`}
          columns={allAppointmentColumns}
          data={allUpcomingAndHandledAppointments}
          actions={[
            {
              label: 'View Profile',
              handler: (row) => navigate(`/patient/${row.Patient_ID}`),
              style: { background: '#95a5a6', color: 'white', borderRadius: '4px' },
            },
          ]}
        />
      </div>
    </div>
  );
};

export default DoctorDashboard;