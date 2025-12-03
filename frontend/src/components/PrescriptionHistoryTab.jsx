// src/components/patientProfile/PrescriptionHistoryTab.jsx
import React from 'react';
// import DataTable from '../../DataTable'; // ⚠️ You need to implement this reusable component

const PrescriptionHistoryTab = ({ data }) => {
    // Define columns for the DataTable
    const columns = [
        { header: 'Date', accessor: 'date' },
        { header: 'Doctor', accessor: 'doctorName' },
        { header: 'Medicines', accessor: 'medicinesList' },
        { header: 'Dosage/Duration', accessor: 'dosageDuration' },
    ];
    
    // Mock data transformation to fit columns (since raw data is mock)
    const formattedData = data.map((p, index) => ({
        ...p,
        date: `2025-10-${20 - index}`, // Mock dates
        doctorName: `Dr. Employee ${index + 1}`,
        medicinesList: `Med A, Med B`,
        dosageDuration: `1-1-1 / 7 days`,
    }));

    return (
        <div>
            {/* If DataTable were ready, you would use: <DataTable columns={columns} data={formattedData} /> */}
            <h4 style={{ marginBottom: '15px' }}>Prescription Records ({data.length})</h4>
            {formattedData.length > 0 ? (
                // Placeholder for DataTable
                <ul style={{ paddingLeft: '20px' }}>
                    {formattedData.map((item, index) => (
                        <li key={index} style={{ marginBottom: '10px' }}>
                            **{item.date}** by {item.doctorName}: {item.medicinesList} ({item.dosageDuration})
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No prescription history found for this patient.</p>
            )}
        </div>
    );
};

export default PrescriptionHistoryTab;