// src/pages/PatientManagerPage.jsx
import React from 'react';
import DataTable from '../components/DataTable';
import { useNavigate } from 'react-router-dom';

const PatientManagerPage = () => {
    const navigate = useNavigate();

    // ⚠️ MOCK DATA for the table
    const mockPatients = [
        { Patient_ID: 1001, Name: 'Elizabeth Swan', DOB: '1985-05-15', Phone: '555-1234', Gender: 'F' },
        { Patient_ID: 1002, Name: 'Will Turner', DOB: '1992-11-20', Phone: '555-5678', Gender: 'M' },
        { Patient_ID: 1003, Name: 'Jack Sparrow', DOB: '1970-01-01', Phone: '555-9012', Gender: 'M' },
        // ... add more to test pagination ...
    ];

    // --- 1. Define Columns ---
    const patientColumns = [
        { header: 'ID', accessor: 'Patient_ID' },
        { header: 'Name', accessor: 'Name' },
        { header: 'DOB', accessor: 'DOB' },
        { header: 'Phone', accessor: 'Phone' },
        { header: 'Gender', accessor: 'Gender' },
    ];
    
    // --- 2. Define Actions ---
    const patientActions = [
        { 
            label: 'View Profile', 
            handler: (row) => navigate(`/patients/${row.Patient_ID}`), // Uses the PatientProfile route
            style: { background: '#27ae60', color: 'white', border: 'none', borderRadius: '4px' } 
        },
        // Receptionist might have an 'Edit' action here too
    ];

    return (
        <div style={{ padding: '20px' }}>
            <h1 style={{ color: '#3498db' }}>Patient Lookup & Manager</h1>
            
            {/* You would add a Search/Filter bar component here */}
            
            <DataTable
                title="Registered Patients"
                columns={patientColumns}
                data={mockPatients}
                actions={patientActions}
                onRowClick={(row) => navigate(`/patients/${row.Patient_ID}`)} // Click row to view profile
            />
            
            {/* Receptionist specific button */}
            <button style={{ background: '#f39c12', color: 'white', padding: '10px 15px', border: 'none', borderRadius: '4px', marginTop: '20px' }}>
                + Register New Patient
            </button>
        </div>
    );
};

export default PatientManagerPage;