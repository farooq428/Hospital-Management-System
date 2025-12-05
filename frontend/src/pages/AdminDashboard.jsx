// src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import StatCard from '../components/StatCard';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/config';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalRoles: 0,
    roomOccupancy: '0%'
  });
  const [loading, setLoading] = useState(true);

  // Fetch dashboard stats from backend
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await API.get('/dashboard/admin');
        setStats({
          totalEmployees: response.data.totalEmployees,
          totalRoles: response.data.totalRoles,
          roomOccupancy: response.data.roomOccupancy
        });
      } catch (error) {
        console.error('Failed to fetch admin stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handleNavigation = (path) => {
    navigate(path);
  };

  const statCards = [
    { title: 'Total Employees', value: stats.totalEmployees, icon: '👥', color: 'blue' },
    { title: 'System Roles Defined', value: stats.totalRoles, icon: '🔑', color: 'blue' },
    { title: 'Current Room Occupancy', value: stats.roomOccupancy, icon: '🏥', color: 'green' },
  ];

  return (
    <div className="min-h-screen p-4 sm:p-8 bg-[#f0f7ff]">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-[#3498db]">
          Admin Control Panel
        </h1>
        <p className="text-gray-600 mt-1">
          Welcome, {user?.name || 'Admin'} — manage users, roles, and resources.
        </p>
      </header>

      {/* Stat Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        {loading ? (
          <p>Loading stats...</p>
        ) : (
          statCards.map((stat) => (
            <StatCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              color={stat.color}
            />
          ))
        )}
      </section>

      {/* Core Management Buttons */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Core Management</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <QuickActionButton
            label="Manage Employees"
            icon="🧑‍💼"
            onClick={() => handleNavigation('/employees')}
            color="blue"
          />
          <QuickActionButton
            label="Define Roles & Access"
            icon="🔐"
            onClick={() => handleNavigation('/roles')}
            color="blue"
          />
          <QuickActionButton
            label="Review System Logs"
            icon="📜"
            onClick={() => handleNavigation('/logs')}
            color="green"
          />
        </div>
      </section>
    </div>
  );
};

const QuickActionButton = ({ label, icon, onClick, color }) => {
  const colorClasses = {
    blue: 'bg-[#3498db] hover:bg-[#1e3a8a] border-[#3498db]',
    green: 'bg-[#2ecc71] hover:bg-[#27ae60] border-[#2ecc71]',
    red: 'bg-[#e74c3c] hover:bg-[#c0392b] border-[#e74c3c]',
    yellow: 'bg-[#f1c40f] hover:bg-[#d4ac0d] border-[#f1c40f]',
  };

  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-6 border-2 rounded-2xl text-white font-semibold text-center text-lg shadow-lg transition transform hover:-translate-y-1 ${colorClasses[color]}`}
    >
      <span className="text-4xl mb-2">{icon}</span>
      {label}
    </button>
  );
};

export default AdminDashboard;
