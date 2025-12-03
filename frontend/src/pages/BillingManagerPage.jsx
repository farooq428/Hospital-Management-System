// src/pages/BillingManagerPage.jsx (Mapped to /bills)
import React, { useState } from 'react';
import DataTable from '../components/DataTable';
import { useNavigate } from 'react-router-dom';
// import BillForm from '../components/forms/BillForm'; // To be implemented next

const mockBills = [
    { Bill_ID: 5001, Patient_ID: 1001, Patient_Name: 'Elizabeth Swan', Date: '2025-11-20', Amount: 150.00, Status: 'Paid' },
    { Bill_ID: 5002, Patient_ID: 1003, Patient_Name: 'Jack Sparrow', Date: '2025-12-01', Amount: 450.50, Status: 'Pending' },
    { Bill_ID: 5003, Patient_ID: 1002, Patient_Name: 'Will Turner', Date: '2025-12-03', Amount: 95.00, Status: 'Paid' },
];

const BillingManagerPage = () => {
    const navigate = useNavigate();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedBill, setSelectedBill] = useState(null);

    const billColumns = [
        { header: 'Bill ID', accessor: 'Bill_ID' },
        { header: 'Patient ID', accessor: 'Patient_ID' },
        { header: 'Patient Name', accessor: 'Patient_Name' },
        { header: 'Date', accessor: 'Date' },
        { header: 'Amount', accessor: 'Amount' },
        { header: 'Status', accessor: 'Status' },
    ];
    
    const handleGenerateNew = () => {
        setSelectedBill(null);
        setIsFormOpen(true);
    };

    const billActions = [
        { 
            label: 'View/Pay', 
            handler: (row) => alert(`Viewing Bill ID: ${row.Bill_ID}. Status: ${row.Status}`),
            style: { background: '#2980b9', color: 'white', border: 'none', borderRadius: '4px' } 
        },
    ];

    return (
        <div style={{ padding: '20px' }}>
            <h1 style={{ color: '#27ae60' }}>Billing and Payments Manager</h1>
            
            <button 
                onClick={handleGenerateNew}
                style={{ padding: '10px 15px', background: '#f1c40f', color: 'black', border: 'none', borderRadius: '4px', marginBottom: '20px' }}
            >
                + Generate New Bill
            </button>
            
            {/* ⚠️ Placeholder for BillForm Modal */}
            {isFormOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div style={{ background: 'white', padding: '30px', borderRadius: '8px', width: '500px' }}>
                        <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px' }}>Generate Bill</h3>
                        {/* <BillForm onClose={() => setIsFormOpen(false)} /> */}
                        <p>Bill Form goes here.</p>
                        <button onClick={() => setIsFormOpen(false)} style={{ marginTop: '15px' }}>Close</button>
                    </div>
                </div>
            )}

            <DataTable
                title="Recent Bills"
                columns={billColumns}
                data={mockBills}
                actions={billActions}
            />
        </div>
    );
};

export default BillingManagerPage;