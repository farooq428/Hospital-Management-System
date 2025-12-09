// src/App.jsx

import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

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

const App = () => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">

      {/* ✅ NAVBAR ONLY (NO SIDEBAR) */}
      <Navbar />

      {/* ✅ MAIN CONTENT */}
      <div className="flex-1 p-4 sm:p-6 bg-gray-100">
        <Routes>

          {/* ✅ PUBLIC ROUTES */}
          <Route path="/login" element={<LoginPage />} />
          

          {/* ✅ ADMIN ROUTES */}
          <Route element={<ProtectedRoute allowedRoles={["Admin"]} />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/employees" element={<EmployeeManagerPage />} />
            <Route path="/roles" element={<RolesPage />} />
            <Route path="/logs" element={<LogsPage />} />
          </Route>

          {/* ✅ DOCTOR ROUTES */}
          <Route element={<ProtectedRoute allowedRoles={["Doctor"]} />}>
            <Route path="/doctor" element={<DoctorDashboard />} />
          </Route>

          {/* ✅ RECEPTIONIST ROUTES */}
          <Route element={<ProtectedRoute allowedRoles={["Receptionist"]} />}>
            <Route path="/receptionist" element={<ReceptionistDashboard />} />
            <Route path="/patients/new" element={<NewPatient />} />
            <Route path="/patients" element={<PatientManagerPage />} />
            <Route path="/appointments/new" element={<NewAppointment />} />
            <Route path="/receptionist/bills" element={<BillingManagerPage />} />
          </Route>

          {/* ✅ SHARED ROUTES */}
          <Route element={<ProtectedRoute allowedRoles={["Admin", "Doctor", "Receptionist"]} />}>
            <Route path="/patients" element={<PatientManagerPage />} />
            <Route path="/patients/:id" element={<PatientProfile />} />
            <Route path="/appointments" element={<AppointmentsPage />} />
            <Route path="/rooms" element={<RoomManagerPage />} />
          </Route>

          {/* ✅ DEFAULT REDIRECT */}
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
                  <LoginPage />
                )
              ) : (
                <LoginPage />
              )
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </div>

      <Footer />
    </div>
  );
};

export default App;
