// src/components/forms/BillForm.jsx
import React, { useState } from 'react';

const mockPatients = [
    { id: 1001, name: 'Elizabeth Swan' },
    { id: 1002, name: 'Will Turner' },
    { id: 1003, name: 'Jack Sparrow' },
];

const BillForm = ({ onClose }) => {
    const [formData, setFormData] = useState({
        patientId: '',
        amount: '',
        description: '', // Reason for the bill
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        console.log('Generating Bill:', formData);
        
        // API Call: POST /api/v1/bills
        
        alert(`Bill generated for Patient ID ${formData.patientId} for $${formData.amount}`);
        onClose(); // Close the modal
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '15px' }}>
            {/* 1. Patient Selection (Key Foreign Key) */}
            <div>
                <label>Select Patient:</label>
                <select name="patientId" value={formData.patientId} onChange={handleChange} required>
                    <option value="">Select Patient</option>
                    {mockPatients.map(p => (
                        <option key={p.id} value={p.id}>{p.name} (ID: {p.id})</option>
                    ))}
                </select>
            </div>
            
            {/* 2. Amount Input */}
            <div>
                <label>Bill Amount ($):</label>
                <input 
                    name="amount" 
                    type="number" 
                    step="0.01" 
                    placeholder="e.g., 250.75" 
                    value={formData.amount} 
                    onChange={handleChange} 
                    required 
                />
            </div>
            
            {/* 3. Description/Notes */}
            <div>
                <label>Description (Services Rendered):</label>
                <textarea 
                    name="description" 
                    rows="3" 
                    placeholder="e.g., Consultation Fee, Lab Work, Medication" 
                    value={formData.description} 
                    onChange={handleChange} 
                    required 
                />
            </div>
            
            <button 
                type="submit" 
                style={{ padding: '10px', background: '#27ae60', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '10px' }}
            >
                Generate Invoice
            </button>
        </form>
    );
};

export default BillForm;