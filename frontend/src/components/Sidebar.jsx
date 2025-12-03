// src/components/Sidebar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { navConfig } from '../config/navConfig';

const Sidebar = () => {
  const { user, getRole } = useAuth();
  const userRole = getRole(); // e.g., 'Doctor'

  if (!userRole) {
    return null; // Don't render sidebar if logged out
  }

  // Get links relevant to the user's role
  const links = navConfig[userRole] || [];

  return (
    <div className="sidebar">
      <div className="logo-section">
        <h3>EasyCare</h3>
        <small>({userRole})</small>
      </div>
      <nav>
        {links.map((item) => (
          <Link key={item.path} to={item.path} className="sidebar-link">
            <span className="icon">{item.icon}</span>
            {item.title}
          </Link>
        ))}
      </nav>
      {/* Add basic styling here (or use CSS file) */}
      <style jsx>{`
        .sidebar {
          width: 250px;
          background: #2c3e50; /* Darker tone for professional look */
          color: white;
          padding: 20px;
          height: 100vh;
          position: fixed;
        }
        .logo-section {
          margin-bottom: 30px;
          text-align: center;
        }
        .sidebar-link {
          display: flex;
          align-items: center;
          padding: 10px 15px;
          margin-bottom: 8px;
          text-decoration: none;
          color: #ecf0f1;
          border-radius: 4px;
          transition: background 0.3s;
        }
        .sidebar-link:hover {
          background: #34495e;
        }
        .icon {
          margin-right: 10px;
          font-size: 1.2em;
        }
      `}</style>
    </div>
  );
};

export default Sidebar;