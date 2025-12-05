// src/components/forms/AppointmentForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/config';
import { useAuth } from '../../context/AuthContext';

const AppointmentForm = ({ initialData = {}, isEdit = false }) => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const token = localStorage.getItem('token');

    const [doctors, setDoctors] = useState([]);
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        patientId: initialData.Patient_ID || '',
        doctorId: initialData.Employee_ID || '',
        date: initialData.Date || '',
        time: initialData.Time || '',
        reason: initialData.Reason || '',
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const [doctorsRes, patientsRes] = await Promise.all([
                    API.get('/employees?role=Doctor', config),
                    API.get('/patients', config),
                ]);
                setDoctors(doctorsRes.data);
                setPatients(patientsRes.data);
            } catch (error) {
                console.error('Failed to fetch patients or doctors:', error);
                alert('Cannot load doctors or patients. Check your permissions.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            if (isEdit) {
                await API.put(`/appointments/${initialData.Appointment_ID}`, formData, config);
                alert('Appointment updated successfully!');
            } else {
                await API.post('/appointments', formData, config);
                alert('Appointment booked successfully!');
            }
            navigate('/appointments');
        } catch (error) {
            console.error('Failed to submit appointment:', error);
            alert('Failed to submit appointment. Check your inputs or permissions.');
        }
    };

    if (loading) return <div className="p-6">Loading form data...</div>;

    return (
        <form 
            onSubmit={handleSubmit} 
            className="bg-white p-6 rounded-lg shadow-md max-w-3xl mx-auto"
        >
            <h3 className="text-xl font-semibold text-blue-600 mb-4">
                {isEdit ? 'Edit Appointment' : 'Book New Appointment'}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
                        {patients.map(p => (
                            <option key={p.Patient_ID} value={p.Patient_ID}>{p.Name}</option>
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
                        {doctors.map(d => (
                            <option key={d.Employee_ID} value={d.Employee_ID}>{d.Name}</option>
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

            <div className="mb-4">
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

            <button 
                type="submit"
                className={`w-full py-2 rounded text-white ${isEdit ? 'bg-yellow-600' : 'bg-blue-600'} hover:opacity-90`}
            >
                {isEdit ? 'Update Appointment' : 'Book Appointment'}
            </button>
        </form>
    );
};

export default AppointmentForm;
