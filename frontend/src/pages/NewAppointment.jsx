// src/pages/NewAppointment.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/config';
import AppointmentForm from '../components/forms/AppointmentForm';

const NewAppointment = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Doctors and Patients from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [patientsRes, doctorsRes] = await Promise.all([
          API.get('/patients'),
          API.get('/employees?role=Doctor'),
        ]);
        setPatients(patientsRes.data);
        setDoctors(doctorsRes.data);
      } catch (error) {
        console.error('Failed to fetch patients or doctors:', error);
        alert('Failed to load patient or doctor list.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (formData) => {
    try {
      const payload = {
        Patient_ID: formData.patientId,
        Employee_ID: formData.doctorId,
        Date: formData.date,
        Time: formData.time,
        Reason: formData.reason,
      };
      await API.post('/appointments', payload);
      alert('Appointment booked successfully!');
      navigate('/appointments'); // Redirect to appointments list
    } catch (error) {
      console.error('Failed to create appointment:', error);
      alert('Server error while booking appointment.');
    }
  };

  if (loading) return <div className="p-6 text-gray-600">Loading data...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-[#3498db] mb-6">Book New Appointment</h2>
      <AppointmentForm
        initialData={{}}
        isEdit={false}
        patients={patients}
        doctors={doctors}
        onSubmit={handleSubmit}
      />
      <button
        className="mt-4 text-[#3498db] hover:underline"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>
    </div>
  );
};

export default NewAppointment;
