import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navLinks = [
  { name: 'Dashboard', path: '/', icon: '🏠', roles: ['Admin', 'Doctor', 'Receptionist'] },
  { name: 'Employee Manager', path: '/employees', icon: '🧑‍💼', roles: ['Admin'] },
  { name: 'Appointments', path: '/appointments', icon: '📅', roles: ['Doctor', 'Receptionist'] },
  { name: 'Patient Manager', path: '/patients', icon: '👤', roles: ['Doctor', 'Receptionist'] },
  { name: 'Billing Manager', path: '/receptionist/bills', icon: '💳', roles: ['Receptionist'] },
  { name: 'Room Manager', path: '/receptionist/rooms', icon: '🛏️', roles: ['Receptionist'] },
];

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  if (!user || location.pathname === '/login') return null;
  const userRole = user?.role;

  return (
    <>
      {/* Mobile Hamburger */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-white bg-[#1e3a8a] p-2 rounded-md shadow-lg focus:outline-none"
        >
          {isOpen ? '✖️' : '☰'}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen bg-[#1e3a8a] text-white flex flex-col shadow-lg
        w-64 md:w-64 transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 z-40`}
      >
        <div className="text-center py-6 font-bold text-2xl border-b border-[#3498db]">
          EasyCare HMS
        </div>

        <p className="text-[#eaf2fb] text-sm px-4 py-2 border-b border-[#3498db]">
          Role: {userRole}
        </p>

        <nav className="flex-1 mt-4">
          {navLinks
            .filter(link => link.roles.includes(userRole))
            .map(link => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 m-2 rounded-lg font-medium transition-colors
                  ${isActive ? 'bg-[#3498db] text-white' : 'hover:bg-[#2c5282] hover:text-white'}`
                }
                onClick={() => setIsOpen(false)}
              >
                <span className="mr-3">{link.icon}</span>
                {link.name}
              </NavLink>
            ))}
        </nav>

        <div className="p-4">
          <button
            onClick={logout}
            className="w-full bg-[#e74c3c] hover:bg-[#c0392b] text-white py-2 rounded-lg font-semibold transition-colors"
          >
            Log Out
          </button>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black opacity-50 z-30 md:hidden"
        />
      )}
    </>
  );
};

export default Sidebar;
