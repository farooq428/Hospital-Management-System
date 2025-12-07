import React, { useState, useEffect, useMemo, useCallback } from 'react';
import StatCard from '../components/StatCard';
import DataTable from '../components/DataTable';
import { useAuth } from '../context/AuthContext';
import API from '../api/config';
import { useNavigate } from 'react-router-dom';

const DoctorDashboard = () => {
  const { user, isAuthLoading } = useAuth();
  const navigate = useNavigate();
  const doctorId = user?.Employee_ID;
  const token = localStorage.getItem("jwtToken");

  const [stats, setStats] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    if (isAuthLoading) {
      setLoading(true);
      return;
    }
    if (!doctorId) {
      setLoading(false);
      console.warn("Doctor ID missing from user context.");
      return;
    }

    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${token}` } };

      // Fetch dashboard stats
      const statsRes = await API.get('/doctor', config);

      // Fetch doctor appointments
      const apptsRes = await API.get('/appointments/doctor', config);

      setStats(statsRes.data);
      setAppointments(apptsRes.data);
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthLoading, doctorId, token]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData, isAuthLoading]);

  // --- Appointment actions ---
  const handleCheckPatient = async (appointment) => {
    const confirm = window.confirm(`Mark appointment with ${appointment.Patient_Name} as Checked?`);
    if (!confirm) return;

    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await API.put(`/appointments/${appointment.Appointment_ID}/status`, { Status: 'Checked' }, config);

      setAppointments(prev =>
        prev.map(a =>
          a.Appointment_ID === appointment.Appointment_ID ? { ...a, Status: 'Checked' } : a
        )
      );
      alert('Patient checked successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to check patient.');
    }
  };

  const handleStartConsultation = (appointment) => {
    navigate(`/patients/${appointment.Patient_ID}`);
  };

  // --- Memoized filters ---
  const todayAppointments = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return appointments.filter(appt => appt.Date === today && appt.Status === 'Scheduled');
  }, [appointments]);

  const allUpcomingAndHandledAppointments = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return appointments
      .filter(appt => appt.Date !== today || appt.Status !== 'Scheduled')
      .sort((a, b) => new Date(a.Date) - new Date(b.Date) || a.Time.localeCompare(b.Time));
  }, [appointments]);

  // --- Columns ---
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

  // --- Render ---
  if (isAuthLoading) return <p className="p-6 text-center text-gray-500">Initializing session...</p>;
  if (loading) return <div className="p-6 text-center text-blue-600">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 inline-block mr-2"></div>
    Loading dashboard...
  </div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-extrabold text-gray-800 mb-2">
        🩺 Welcome Back, Dr. {user?.Name || 'Doctor'}
      </h2>
      <p className="text-gray-500 mb-6">Your agenda and clinical resources are below.</p>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard title="Today's Scheduled" value={todayAppointments.length} icon="📅" color="#3498db" />
        <StatCard title="Total Patients Under Care" value={stats?.totalPatients || 0} icon="👤" color="#2ecc71" />
        <StatCard title="Pending Test Reviews" value={stats?.pendingReports || 0} icon="🔬" color="#f39c12" />
      </div>

      <hr className="mb-8 border-gray-200" />

      {/* Today's Appointments */}
      <div className="mb-10">
        <h3 className="text-2xl font-semibold mb-4 text-blue-700">Today's Scheduled Consultations</h3>
        <DataTable
          title={`Pending (${todayAppointments.length})`}
          columns={todayAppointmentColumns}
          data={todayAppointments}
          actions={[
            { label: 'Check Patient', handler: handleCheckPatient, style: { background: '#27ae60', color: 'white', borderRadius: '4px' } },
            { label: 'Start Consultation', handler: handleStartConsultation, style: { background: '#3498db', color: 'white', borderRadius: '4px' } },
          ]}
        />
      </div>

      {/* All Appointments */}
      <div>
        <h3 className="text-2xl font-semibold mb-4 text-gray-700">All Appointments ({appointments.length})</h3>
        <DataTable
          title={`All Appointments (${allUpcomingAndHandledAppointments.length})`}
          columns={allAppointmentColumns}
          data={allUpcomingAndHandledAppointments}
          actions={[
            { label: 'View Profile', handler: (row) => navigate(`/patients/${row.Patient_ID}`), style: { background: '#95a5a6', color: 'white', borderRadius: '4px' } },
          ]}
        />
      </div>
    </div>
  );
};

export default DoctorDashboard;
