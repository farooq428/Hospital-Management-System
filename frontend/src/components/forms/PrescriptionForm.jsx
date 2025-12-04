// src/components/forms/PrescriptionForm.jsx
import React, { useState } from 'react';

const PrescriptionForm = ({ patientId, doctorId, onSave }) => {
    const [prescription, setPrescription] = useState({
        medicinesList: '',
        dosage: '',
        duration: '',
        notes: '', 
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPrescription(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const finalData = {
            ...prescription,
            patientId,
            doctorId,
            date: new Date().toISOString().split('T')[0], // Current Date
        };

        console.log('Final Prescription Data:', finalData);
        // API Call: POST /api/v1/prescriptions

        alert(`Prescription saved for Patient ID: ${patientId}`);
        onSave(); // Close modal or clear form
    };

    return (
        <form onSubmit={handleSubmit} style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h4 style={{ color: '#2ecc71' }}>New Prescription</h4>
            <p>Prescribed by Dr. {doctorId} for Patient ID: {patientId}</p>

            <div style={{ marginBottom: '15px' }}>
                <label>Medicines List (Names/Qty):</label>
                <textarea name="medicinesList" rows="4" value={prescription.medicinesList} onChange={handleChange} placeholder="e.g., Amoxicillin 500mg - 10 tabs" required />
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                <div>
                    <label>Dosage:</label>
                    <input name="dosage" value={prescription.dosage} onChange={handleChange} placeholder="e.g., 1-1-1 after meals" required />
                </div>
                <div>
                    <label>Duration:</label>
                    <input name="duration" value={prescription.duration} onChange={handleChange} placeholder="e.g., 7 days" required />
                </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
                <label>Doctor's Notes (Internal):</label>
                <textarea name="notes" rows="2" value={prescription.notes} onChange={handleChange} placeholder="Optional consultation notes." />
            </div>
            
            <button type="submit" style={{ padding: '10px 20px', background: '#2ecc71', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                Issue Prescription
            </button>
        </form>
    );
};

export default PrescriptionForm;