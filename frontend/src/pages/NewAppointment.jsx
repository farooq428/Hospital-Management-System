import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/config';
import AppointmentForm from '../components/forms/AppointmentForm';
import PastTimeModal from '../components/PastTimeModal';

const NewAppointment = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

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

  const showModal = (message) => {
    setModalMessage(message);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalMessage('');
  };

  const handleSubmit = async (formData) => {
    // formData.date is in dd/mm/yyyy format
    const [day, month, year] = formData.date.split('/').map(Number);
    const [hour, minute] = formData.time.split(':').map(Number);

    const appointmentDateTime = new Date(year, month - 1, day, hour, minute, 0);
    const now = new Date();

    // Debug logs to check values
    console.log('Input date/time:', formData.date, formData.time);
    console.log('Parsed appointmentDateTime:', appointmentDateTime);
    console.log('Current date/time:', now);

    if (appointmentDateTime <= now) {
      showModal(
        `The selected date and time (${formData.date} ${formData.time}) are in the past. Please select a future date and time.`
      );
      return;
    }

    try {
      const payload = {
        Patient_ID: formData.patientId,
        Employee_ID: formData.doctorId,
        Date: `${year}-${month.toString().padStart(2,'0')}-${day.toString().padStart(2,'0')}`,
        Time: `${hour.toString().padStart(2,'0')}:${minute.toString().padStart(2,'0')}:00`,
        Reason: formData.reason,
      };

      await API.post('/appointments', payload);
      alert('Appointment booked successfully!');
      navigate('/appointments');
    } catch (error) {
      console.error('Failed to create appointment:', error);
      showModal('A server error occurred while booking the appointment. Please try again.');
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
        onSubmit={handleSubmit} // Pass parent submit
      />

      <button
        className="mt-4 text-[#3498db] hover:underline"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>

      <PastTimeModal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="Appointment Blocked"
        message={modalMessage}
      />
    </div>
  );
};

export default NewAppointment;
