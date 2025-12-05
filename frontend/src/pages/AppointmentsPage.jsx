// src/pages/AppointmentsPage.jsx
import React, { useState, useEffect } from "react";
import DataTable from "../components/DataTable";
import AppointmentForm from "../components/forms/AppointmentForm";
import { useAuth } from "../context/AuthContext";
import API from "../api/config";

const AppointmentsPage = () => {
  const { user } = useAuth();
  const isReceptionist = user?.role === "Receptionist";

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // ✅✅✅ FETCH APPOINTMENTS WITH TOKEN
  const fetchAppointments = async () => {
    try {
      const response = await API.get("/appointments", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setAppointments(response.data || []);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // ✅ CANCEL APPOINTMENT
  const handleCancel = async (appointmentId) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this appointment?"
    );

    if (!confirmCancel) return;

    try {
      setActionLoading(true);

      await API.delete(`/appointments/${appointmentId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      alert("Appointment cancelled successfully ✅");
      fetchAppointments();
    } catch (error) {
      console.error("Cancel error:", error);
      alert("Failed to cancel appointment ❌");
    } finally {
      setActionLoading(false);
    }
  };

  const appointmentColumns = [
    { header: "ID", accessor: "Appointment_ID" },
    { header: "Date", accessor: "Date" },
    { header: "Time", accessor: "Time" },
    { header: "Patient", accessor: "Patient_Name" },
    { header: "Doctor", accessor: "Doctor_Name" },
    { header: "Reason", accessor: "Reason" },
  ];

  const appointmentActions = [
    {
      label: "Cancel",
      handler: (row) => handleCancel(row.Appointment_ID),
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh] text-gray-600 text-lg">
        Loading Appointments...
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 p-3 sm:p-6">

      {/* HEADER */}
      <div className="bg-white rounded-xl shadow p-4 sm:p-6 mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-blue-700">
              Appointment Manager
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Manage all scheduled appointments
            </p>
          </div>

          {isReceptionist && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white
                px-5 py-3 sm:py-2 rounded-lg font-semibold shadow transition"
            >
              + Book New Appointment
            </button>
          )}
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow border p-4 overflow-x-auto">
        <DataTable
          title="All Scheduled Appointments"
          columns={appointmentColumns}
          data={appointments}
          actions={appointmentActions}
        />
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50"
            onClick={() => setIsModalOpen(false)}
          />

          <div className="fixed z-50 inset-x-0 bottom-0 sm:top-1/2 sm:-translate-y-1/2 mx-auto w-full sm:max-w-2xl px-3">
            <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl">

              <div className="flex items-center justify-between px-5 py-3 border-b">
                <h3 className="text-lg font-semibold text-blue-700">
                  Book New Appointment
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200"
                >
                  ✕
                </button>
              </div>

              <div className="p-4 sm:p-6">
                <AppointmentForm
                  onClose={() => {
                    setIsModalOpen(false);
                    fetchAppointments();
                  }}
                />
              </div>

            </div>
          </div>
        </>
      )}

      {/* ✅ LOADING OVERLAY WHEN CANCELLING */}
      {actionLoading && (
        <div className="fixed inset-0 z-[100] bg-black/30 flex items-center justify-center">
          <div className="bg-white px-6 py-3 rounded-lg shadow text-blue-700 font-semibold">
            Processing...
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentsPage;
