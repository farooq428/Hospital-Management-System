// src/pages/PatientManagerPage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx'; // <-- Import useAuth
// ... other imports

const PatientManagerPage = () => {
    const { user } = useAuth(); // Get user role
    // ... state and useEffect hooks ...

    const isReceptionist = user?.role === 'Receptionist';
    
    // Define columns and actions...

    return (
        <div style={{ padding: '20px' }}>
            <h1>Patient Manager</h1>
            
            {/* 1. Only render the "Add New Patient" button for Receptionist */}
            {isReceptionist && (
                <button 
                    onClick={() => setIsModalOpen(true)}
                    style={{ /* ... styles ... */ }}
                >
                    + Add New Patient
                </button>
            )}
            
            <DataTable
                title="Registered Patients"
                // ...
                // 2. Conditionally pass actions to DataTable (e.g., Delete action is hidden unless Receptionist)
                actions={isReceptionist ? patientActions : [{ label: 'View', handler: handleViewProfile, style: {/*...*/} }]}
            />
        </div>
    );
};

export default PatientManagerPage;