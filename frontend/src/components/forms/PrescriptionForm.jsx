// src/components/forms/PrescriptionForm.jsx

import React, { useState } from 'react';
import API from '../../api/config';
import { useAuth } from '../../context/AuthContext'; // To get doctorId

const PrescriptionForm = ({ patientId, doctorId, onSave, onClose }) => {
    const { token } = useAuth(); // Assuming useAuth provides token

    const [prescription, setPrescription] = useState({
        medicinesList: '',
        dosage: '',
        duration: '',
        notes: '', // Notes field is not in DB but kept for doctor's internal use/future expansion
    });
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPrescription(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // ⚠️ Data mapping to match DB schema
        const payload = {
            Patient_ID: patientId,
            Employee_ID: doctorId,
            Date: new Date().toISOString().split('T')[0], // Current Date (YYYY-MM-DD)
            Medicines_List: prescription.medicinesList,
            Dosage: prescription.dosage,
            Duration: prescription.duration,
            // Notes not sent to DB based on schema, but can be logged or added to a separate table
        };

        if (!payload.Medicines_List || !payload.Dosage || !payload.Duration) {
            alert("Please fill in all required prescription details.");
            return;
        }

        try {
            setSubmitting(true);
            const config = { headers: { Authorization: `Bearer ${token}` } };
            
            // API Call: POST /api/v1/prescriptions
            await API.post("/prescriptions", payload, config);

            alert(`Prescription successfully issued for Patient ID: ${patientId}`);
            if (onSave) onSave(); // Call success handler
            if (onClose) onClose();
        } catch (err) {
            console.error("Failed to submit prescription:", err);
            alert(
                err.response?.data?.message || "Failed to issue prescription. Please check API connection."
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form 
            onSubmit={handleSubmit} 
            className="bg-white p-6 rounded-lg shadow-xl max-w-lg mx-auto space-y-4 border border-green-200"
        >
            <h4 className="text-2xl font-bold text-green-600 border-b pb-2 mb-4">✍️ New Prescription</h4>
            <p className="text-sm text-gray-600">
                Prescribed by Dr. **{doctorId}** for Patient ID: **{patientId}**
            </p>

            <div>
                <label className="block text-gray-700 font-medium mb-1">Medicines List (Names/Qty):</label>
                <textarea 
                    name="medicinesList" 
                    rows="4" 
                    value={prescription.medicinesList} 
                    onChange={handleChange} 
                    placeholder="e.g., Amoxicillin 500mg - 10 tabs, Paracetamol 500mg - 20 tabs" 
                    required 
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-gray-700 font-medium mb-1">Dosage:</label>
                    <input 
                        name="dosage" 
                        value={prescription.dosage} 
                        onChange={handleChange} 
                        placeholder="e.g., 1-1-1 after meals" 
                        required 
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 font-medium mb-1">Duration:</label>
                    <input 
                        name="duration" 
                        value={prescription.duration} 
                        onChange={handleChange} 
                        placeholder="e.g., 7 days" 
                        required 
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    />
                </div>
            </div>

            <div>
                <label className="block text-gray-700 font-medium mb-1">Doctor's Notes (Internal - Optional):</label>
                <textarea 
                    name="notes" 
                    rows="2" 
                    value={prescription.notes} 
                    onChange={handleChange} 
                    placeholder="Optional consultation notes for record keeping." 
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                />
            </div>
            
            <button 
                type="submit" 
                disabled={submitting}
                className={`w-full py-3 rounded-md font-semibold transition duration-150 ${
                    submitting ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
            >
                {submitting ? 'Issuing...' : 'Issue Prescription'}
            </button>
        </form>
    );
};

export default PrescriptionForm;