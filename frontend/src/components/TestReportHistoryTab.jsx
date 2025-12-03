// src/components/patientProfile/TestReportHistoryTab.jsx
import React, { useState } from 'react';
import DataTable from '../../components/DataTable';

const TestReportHistoryTab = ({ data, patientId }) => {
    // ⚠️ Mock Reports Data (received from the parent PatientProfile component)
    const mockReports = [
        { Report_ID: 701, Date: '2025-09-15', Type: 'Blood Panel', Result_Summary: 'Normal range, slightly high cholesterol.' },
        { Report_ID: 702, Date: '2025-11-01', Type: 'X-Ray', Result_Summary: 'No fractures detected.' },
        { Report_ID: 703, Date: '2025-12-01', Type: 'ECG', Result_Summary: 'Sinus rhythm, normal.' },
    ];
    
    const reportColumns = [
        { header: 'Report ID', accessor: 'Report_ID' },
        { header: 'Date', accessor: 'Date' },
        { header: 'Test Type', accessor: 'Type' },
        { header: 'Summary', accessor: 'Result_Summary' },
    ];
    
    const handleViewReport = (report) => {
        // In a real application, this would open a PDF or a detailed view of the Result text
        alert(`Viewing full details for Report ID ${report.Report_ID}.\nSummary: ${report.Result_Summary}`);
    };

    const reportActions = [
        { 
            label: 'View', 
            handler: handleViewReport,
            style: { background: '#16a085', color: 'white', border: 'none', borderRadius: '4px' } 
        },
    ];

    return (
        <div>
            <h4 style={{ marginBottom: '15px' }}>Test Report History ({mockReports.length})</h4>
            <DataTable 
                columns={reportColumns} 
                data={mockReports} 
                actions={reportActions} 
            />
            <button 
                style={{ marginTop: '20px', padding: '10px 15px', background: '#3498db', color: 'white', border: 'none', borderRadius: '4px' }}
            >
                + Upload New Report (Admin/Lab Access)
            </button>
        </div>
    );
};

export default TestReportHistoryTab;