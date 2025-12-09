import React, { useState, useEffect } from "react";
import API from "../../api/config";
import { useAuth } from "../../context/AuthContext";

const AppointmentForm = ({ initialData = {}, isEdit = false, onSuccess, onClose }) => {
  const { user } = useAuth();
  const token = localStorage.getItem("token");

  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    patientId: initialData.Patient_ID || "",
    doctorId: initialData.Employee_ID || "",
    date: initialData.Date || "",
    time: initialData.Time || "",
    reason: initialData.Reason || "",
  });

  // Fetch doctors and patients
  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const [doctorsRes, patientsRes] = await Promise.all([
          API.get("/employees?role=Doctor", config),
          API.get("/patients", config),
        ]);
        setDoctors(doctorsRes.data);
        setPatients(patientsRes.data);
      } catch (error) {
        console.error("Failed to fetch doctors or patients:", error);
        alert("Cannot load doctors or patients. Check your permissions.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const { patientId, doctorId, date, time, reason } = formData;
  if (!patientId || !doctorId || !date || !time || !reason) {
    alert("Please fill all fields");
    return;
  }

  // --- Check for past date/time ---
  const selectedDateTime = new Date(`${date}T${time}`);
  const now = new Date();

  console.log("Selected appointment:", selectedDateTime);
  console.log("Current date/time:", now);

  if (selectedDateTime < now) {
    alert("You cannot book an appointment in the past. Please select a future date and time.");
    return;
  }
  // --- End of check ---

  try {
    setSubmitting(true);
    const config = { headers: { Authorization: `Bearer ${token}` } };
    let response;

    if (isEdit) {
      response = await API.put(
        `/appointments/${initialData.Appointment_ID}`,
        formData,
        config
      );
      alert("Appointment updated successfully!");
    } else {
      response = await API.post("/appointments", formData, config);
      alert("Appointment booked successfully!");
    }

    const appointmentObj = {
      Appointment_ID: isEdit
        ? initialData.Appointment_ID
        : response.data.appointmentId,
      Date: date,
      Time: time,
      Patient_Name: patients.find((p) => p.Patient_ID == patientId)?.Name,
      Doctor_Name: doctors.find((d) => d.Employee_ID == doctorId)?.Name,
      Reason: reason,
      Status: isEdit ? initialData.Status : "Scheduled",
    };

    if (onSuccess) onSuccess(appointmentObj);

    if (!isEdit)
      setFormData({ patientId: "", doctorId: "", date: "", time: "", reason: "" });

    if (onClose) onClose();
  } catch (err) {
    console.error("Failed to submit appointment:", err);
    alert(
      err.response?.data?.message ||
        "Failed to submit appointment. Check your inputs or permissions."
    );
  } finally {
    setSubmitting(false);
  }
};


  if (loading) return <div className="p-6 text-center text-gray-600">Loading form data...</div>;

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow-md max-w-3xl mx-auto space-y-4"
    >
      <h3 className="text-xl font-semibold text-blue-600 mb-4">
        {isEdit ? "Edit Appointment" : "Book New Appointment"}
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 mb-1">Patient</label>
          <select
            name="patientId"
            value={formData.patientId}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          >
            <option value="">Select Patient</option>
            {patients.map((p) => (
              <option key={p.Patient_ID} value={p.Patient_ID}>
                {p.Name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-700 mb-1">Doctor</label>
          <select
            name="doctorId"
            value={formData.doctorId}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          >
            <option value="">Select Doctor</option>
            {doctors.map((d) => (
              <option key={d.Employee_ID} value={d.Employee_ID}>
                {d.Name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-700 mb-1">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-1">Time</label>
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>
      </div>

      <div>
        <label className="block text-gray-700 mb-1">Reason</label>
        <textarea
          name="reason"
          rows="3"
          value={formData.reason}
          onChange={handleChange}
          placeholder="Reason for appointment"
          required
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mt-4">
        <button
          type="submit"
          disabled={submitting}
          className={`flex-1 py-2 rounded text-white font-semibold ${
            isEdit ? "bg-yellow-600 hover:opacity-90" : "bg-blue-600 hover:opacity-90"
          }`}
        >
          {submitting ? (isEdit ? "Updating..." : "Booking...") : isEdit ? "Update Appointment" : "Book Appointment"}
        </button>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 rounded bg-gray-400 text-white hover:opacity-90"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default AppointmentForm;
