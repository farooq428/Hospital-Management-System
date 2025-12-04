// src/components/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

// Define Navigation links based on required role(s)
const navLinks = [
    { name: 'Dashboard', path: '/', icon: '🏠', roles: ['Admin', 'Doctor', 'Receptionist'] },
    { name: 'Appointments', path: '/appointments', icon: '📅', roles: ['Receptionist', 'Doctor'] },
    { name: 'Patient Manager', path: '/patients', icon: '👤', roles: ['Receptionist', 'Doctor'] },
    { name: 'Billing Manager', path: '/bills', icon: '💳', roles: ['Receptionist'] },
    { name: 'Room Manager', path: '/rooms', icon: '🛏️', roles: ['Receptionist', 'Admin'] },
    { name: 'Employee Manager', path: '/employees', icon: '🧑‍💼', roles: ['Admin'] },
];

const Sidebar = () => {
    const { user, logout } = useAuth(); // Get user object (which contains the role)

    // User must be authenticated to show the sidebar
    if (!user) return null; 

    const userRole = user.role;

    return (
        <div style={styles.sidebar}>
            <h2 style={styles.logo}>EasyCare HMS</h2>
            <p style={styles.roleLabel}>Role: **{userRole}**</p>
            <hr style={styles.separator} />
            
            <nav>
                {navLinks
                    .filter(link => link.roles.includes(userRole)) // <-- Filter based on user's role
                    .map(link => (
                        <NavLink key={link.name} to={link.path} style={({ isActive }) => ({
                            ...styles.navItem,
                            ...(isActive ? styles.activeNavItem : {})
                        })}>
                            <span style={styles.navIcon}>{link.icon}</span>
                            {link.name}
                        </NavLink>
                    ))}
            </nav>

            <button onClick={logout} style={styles.logoutButton}>
                Log Out
            </button>
        </div>
    );
};

// ... (Define styles.js or inline styles used above)
const styles = {
    // ... (Your previous styles for sidebar, navItem, etc.)
    roleLabel: { 
        color: '#ccc', 
        fontSize: '0.9em', 
        padding: '0 15px 10px', 
        borderBottom: '1px solid #333' 
    },
    logoutButton: {
        // ...
        position: 'absolute',
        bottom: '20px',
        width: 'calc(100% - 30px)',
    }
    // ...
};

export default Sidebar;