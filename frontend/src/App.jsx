// src/App.jsx

import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Sidebar from "./components/Sidebar";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import AdminDashboard from "./pages/AdminDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import ReceptionistDashboard from "./pages/ReceptionistDashboard";
import PatientManagerPage from "./pages/PatientManagerPage";
import PatientProfile from "./components/PatientProfile";
import NewPatient from "./pages/NewPatient";
import AppointmentsPage from "./pages/AppointmentsPage";
import NewAppointment from "./pages/NewAppointment";
import EmployeeManagerPage from "./pages/EmployeeManagerPage";
import BillingManagerPage from "./pages/BillingManagerPage";
import RoomManagerPage from "./pages/RoomManagerPage";
import RolesPage from "./pages/RolesPage";
import LogsPage from "./pages/LogsPage";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";

const App = () => {
  const { user } = useAuth();
  const location = useLocation();
  const isDoctorPage = location.pathname.startsWith("/doctor");

  const publicRoutes = ["/login", "/home"];
  const showSidebar =
    user && !publicRoutes.includes(location.pathname) && !isDoctorPage;

  return (

    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* The Navbar will stick to the top */}
      <Navbar />
    <div className="flex min-h-screen bg-gray-100">
      {showSidebar && <Sidebar />}

      <main
        className={`flex-1 transition-all p-4 sm:p-6 ${
          showSidebar ? "md:ml-64" : "ml-0"
        }`}
      >
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/home" element={<HomePage />} />

          {/* --- ADMIN ONLY Routes --- */}
          <Route element={<ProtectedRoute allowedRoles={["Admin"]} />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/employees" element={<EmployeeManagerPage />} />
            <Route path="/roles" element={<RolesPage />} />
            <Route path="/logs" element={<LogsPage />} />
            {/* RoomManagerPage and PatientProfile moved to Shared Staff Routes */}
          </Route>

          {/* --- DOCTOR ONLY Routes --- */}
          <Route element={<ProtectedRoute allowedRoles={["Doctor"]} />}>
            <Route path="/doctor" element={<DoctorDashboard />} />
            {/* Note: PatientProfile moved to Shared Staff Routes */}
          </Route>

          {/* --- RECEPTIONIST ONLY Routes --- */}
          <Route element={<ProtectedRoute allowedRoles={["Receptionist"]} />}>
            <Route path="/receptionist" element={<ReceptionistDashboard />} />
            <Route path="/patients/new" element={<NewPatient />} />
            <Route path="/appointments/new" element={<NewAppointment />} />
            <Route
              path="/receptionist/bills"
              element={<BillingManagerPage />}
            />
            {/* Note: RoomManagerPage and PatientProfile moved to Shared Staff Routes */}
          </Route>

          {/* 🚀 SHARED STAFF Routes (Admin, Doctor, Receptionist) 🚀 */}
          {/* Routes accessed by all three employee types */}
          <Route
            element={
              <ProtectedRoute
                allowedRoles={["Admin", "Doctor", "Receptionist"]}
              />
            }
          >
            {/* Patient Management */}
            <Route path="/patients" element={<PatientManagerPage />} />
            <Route path="/patients/:id" element={<PatientProfile />} />

            {/* Appointments */}
            <Route path="/appointments" element={<AppointmentsPage />} />

            {/* Rooms (Used by Admin and Receptionist/Front Desk) */}
            {/* Note: The old /receptionist/rooms paths still work via routing fallthrough */}
            <Route path="/rooms" element={<RoomManagerPage />} />
          </Route>

          {/* --- Default Redirect --- */}
          <Route
            path="/"
            element={
              user ? (
                user.role === "Admin" ? (
                  <Navigate to="/admin" replace />
                ) : user.role === "Doctor" ? (
                  <Navigate to="/doctor" replace />
                ) : user.role === "Receptionist" ? (
                  <Navigate to="/receptionist" replace />
                ) : (
                  <HomePage />
                )
              ) : (
                <HomePage />
              )
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      
    </div>
    <Footer />
    </div>
     
  );
};

export default App;
