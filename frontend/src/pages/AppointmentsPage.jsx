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

  // ✅✅✅ CANCEL + INSTANT UI UPDATE
  const handleCancel = async (appointmentId) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this appointment?"
    );

    if (!confirmCancel) return;

    try {
      setActionLoading(true);

      await API.put(
        `/appointments/cancel/${appointmentId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // ✅✅✅ INSTANT UI CHANGE
      setAppointments((prev) =>
        prev.map((appt) =>
          appt.Appointment_ID === appointmentId
            ? { ...appt, Status: "Cancelled" }
            : appt
        )
      );

      alert("Appointment cancelled ✅");
    } catch (error) {
      console.error("Cancel error:", error);
      alert("Cancel failed ❌");
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
    { header: "Status", accessor: "Status" }, // ✅ STATUS COLUMN
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
      <div className="bg-white rounded-xl shadow p-4 mb-4 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-blue-700">
            Appointment Manager
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage all scheduled appointments
          </p>
        </div>

        {isReceptionist && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold"
          >
            + Book Appointment
          </button>
        )}
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

      {/* LOADING OVERLAY */}
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
