// src/components/forms/RoomAssignmentForm.jsx
import React, { useState } from 'react';

const mockPatients = [
    { id: 1007, name: 'Zoe Washburne' },
    { id: 1008, name: 'Mal Reynolds' },
];

const RoomAssignmentForm = ({ room, onAssign }) => {
    const [formData, setFormData] = useState({
        patientId: '',
        admissionDate: new Date().toISOString().slice(0, 16), // Default to current time
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const assignmentData = {
            Room_ID: room.Room_ID,
            ...formData
        };

        console.log('New Room Assignment Data:', assignmentData);
        // API Call: POST /api/v1/room-assignment

        alert(`Patient ${formData.patientId} assigned to Room ${room.Room_ID}!`);
        onAssign(); 
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '15px' }}>
            <p>Assigning to **Room {room.Room_ID}** ({room.Room_Type})</p>
            
            {/* Patient Selection (Key Foreign Key) */}
            <div>
                <label>Select Patient for Admission:</label>
                <select name="patientId" value={formData.patientId} onChange={handleChange} required>
                    <option value="">Select Patient</option>
                    {mockPatients.map(p => (
                        <option key={p.id} value={p.id}>{p.name} (ID: {p.id})</option>
                    ))}
                </select>
            </div>
            
            {/* Admission Date/Time */}
            <div>
                <label>Admission Date/Time:</label>
                <input 
                    name="admissionDate" 
                    type="datetime-local" 
                    value={formData.admissionDate} 
                    onChange={handleChange} 
                    required 
                />
            </div>
            
            <button 
                type="submit" 
                style={{ padding: '10px', background: '#2ecc71', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '10px' }}
            >
                Confirm Admission
            </button>
        </form>
    );
};

export default RoomAssignmentForm;