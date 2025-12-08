// src/components/Navbar.jsx

import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navLinks = [
  { name: "Home", path: "/", roles: ["Admin", "Doctor", "Receptionist"] },

  { name: "Employee Manager", path: "/employees", roles: ["Admin"] },

  { name: "Appointments", path: "/appointments", roles: ["Doctor", "Receptionist", "Admin"] },

  { name: "Billing Manager", path: "/receptionist/bills", roles: ["Receptionist"] },

  { name: "Room Manager", path: "/rooms", roles: ["Receptionist", "Admin"] },
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // ✅ Hide navbar on login page
  if (!user) return null;

  const userRole = user.role;

  return (
    <nav className="bg-[#1e3a8a] shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">

          {/* ✅ Brand */}
          <Link to="/" className="text-white text-xl font-bold tracking-wide">
            EasyCare HMS
          </Link>

          {/* ✅ Role-Based Links (EXACT sidebar rules) */}
          <div className="hidden md:flex space-x-4">
            {navLinks
              .filter(link => link.roles.includes(userRole))
              .map(link => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-sm font-semibold transition
                    ${
                      isActive
                        ? "bg-blue-500 text-white"
                        : "text-blue-100 hover:bg-blue-700 hover:text-white"
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
          </div>

          {/* ✅ USER INFO + LOGOUT */}
          <div className="flex items-center gap-4">
            <span className="text-white text-sm hidden sm:block">
              {user.name || user.Employee_ID} ({user.role})
            </span>

            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1.5 rounded-md font-semibold"
            >
              Logout
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
