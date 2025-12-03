// src/components/forms/AppointmentForm.jsx
import React, { useState, useEffect } from 'react';
// import CustomInput, PrimaryButton from '../CustomInput/PrimaryButton'; // Assuming reusable components

const AppointmentForm = ({ initialData = {}, isEdit = false }) => {
    // ⚠️ MOCK Data for Select Inputs
    const [doctors, setDoctors] = useState([
        { id: 1, name: 'Dr. Gregory House', role: 'Doctor' },
        { id: 2, name: 'Dr. Jane Foster', role: 'Doctor' },
        { id: 3, name: 'Dr. John Carter', role: 'Doctor' },
    ]);
    const [patients, setPatients] = useState([
        { id: 1001, name: 'Elizabeth Swan' },
        { id: 1002, name: 'Will Turner' },
        { id: 1003, name: 'Jack Sparrow' },
    ]);
    
    // Form State mapped to Appointment entity attributes
    const [formData, setFormData] = useState({
        patientId: initialData.Patient_ID || '',
        doctorId: initialData.Employee_ID || '',
        date: initialData.Date || '',
        time: initialData.Time || '',
        reason: initialData.Reason || '', // Custom field for better context
    });
    
    // In a real app, you would fetch the list of Doctors and Patients here
    useEffect(() => {
        // fetch Doctors: `/api/v1/employees?role=Doctor`
        // fetch Patients for search: `/api/v1/patients/names`
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        console.log('Submitting Appointment Data:', formData);
        
        // 1. Validation (e.g., check if the slot is free)
        // 2. API Call (POST or PUT)

        alert(isEdit ? 'Appointment Updated Successfully!' : 'New Appointment Booked!');
        // On success, navigate back to the dashboard or clear form.
    };

    return (
        <form onSubmit={handleSubmit} style={{ background: '#fff', padding: '30px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.05)' }}>
            <h4 style={{ color: '#2980b9' }}>{isEdit ? 'Edit Appointment' : 'Book New Appointment'}</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                
                {/* 1. Patient Selection (Connects to Patient Entity) */}
                <div>
                    <label>Patient:</label>
                    <select name="patientId" value={formData.patientId} onChange={handleChange} required>
                        <option value="">Select Existing Patient</option>
                        {patients.map(p => (
                            <option key={p.id} value={p.id}>{p.name} (ID: {p.id})</option>
                        ))}
                    </select>
                </div>

                {/* 2. Doctor Selection (Connects to Employee Entity) */}
                <div>
                    <label>Doctor:</label>
                    <select name="doctorId" value={formData.doctorId} onChange={handleChange} required>
                        <option value="">Select Doctor</option>
                        {doctors.map(d => (
                            <option key={d.id} value={d.id}>{d.name}</option>
                        ))}
                    </select>
                </div>
                
                {/* 3. Date and Time Selection (Appointment Entity) */}
                <div>
                    <label>Date:</label>
                    <input type="date" name="date" value={formData.date} onChange={handleChange} required />
                </div>
                <div>
                    <label>Time Slot:</label>
                    <input type="time" name="time" value={formData.time} onChange={handleChange} required />
                </div>
            </div>
            
            {/* 4. Reason for Appointment */}
            <div style={{ marginBottom: '20px' }}>
                <label>Reason for Visit:</label>
                <textarea name="reason" rows="3" value={formData.reason} onChange={handleChange} placeholder="Briefly describe the reason for the appointment." required />
            </div>
            
            <button type="submit" style={{ padding: '10px 20px', background: isEdit ? '#f39c12' : '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                {isEdit ? 'Update Booking' : 'Confirm Booking'}
            </button>
        </form>
    );
};

export default AppointmentForm; 