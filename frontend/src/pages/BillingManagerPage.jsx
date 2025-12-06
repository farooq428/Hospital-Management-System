import React, { useState, useEffect } from 'react';
import DataTable from '../components/DataTable';
import BillForm from '../components/forms/BillForm';
import API from '../api/config';

const BillingManagerPage = () => {
  const [bills, setBills] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Fetch bills from backend
  useEffect(() => {
    const fetchBills = async () => {
      try {
        const res = await API.get('/bills');
        setBills(res.data);
      } catch (err) {
        console.error('Failed to fetch bills:', err);
      }
    };
    fetchBills();
  }, []);

  const billColumns = [
    { header: 'Bill ID', accessor: 'Bill_ID' },
    { header: 'Patient ID', accessor: 'Patient_ID' },
    { header: 'Patient Name', accessor: 'Patient_Name' },
    { header: 'Date', accessor: 'Date' },
    { header: 'Amount', accessor: 'Amount' },
    { header: 'Status', accessor: 'Status' },
  ];

  const handlePrintBill = async (row) => {
    const amount = parseFloat(row.Amount); // Fix for string from backend

    const printContent = `
      <html>
        <head>
          <title>Bill ID: ${row.Bill_ID}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h2 { color: #27ae60; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            td, th { border: 1px solid #ccc; padding: 8px; text-align: left; }
          </style>
        </head>
        <body>
          <h2>EasyCare HMS - Bill</h2>
          <p><strong>Bill ID:</strong> ${row.Bill_ID}</p>
          <p><strong>Patient:</strong> ${row.Patient_Name} (ID: ${row.Patient_ID})</p>
          <p><strong>Date:</strong> ${row.Date}</p>
          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th>Amount ($)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Services / Consultation</td>
                <td>${amount.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
          <p><strong>Status:</strong> ${row.Status}</p>
        </body>
      </html>
    `;

    const printWindow = window.open('', '', 'width=800,height=600');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();

    // Mark as Paid if pending
    if (row.Status === 'Pending') {
      try {
        await API.put(`/bills/${row.Bill_ID}/status`, { status: 'Paid' });
        setBills(prev =>
          prev.map(b => b.Bill_ID === row.Bill_ID ? { ...b, Status: 'Paid' } : b)
        );
      } catch (err) {
        console.error('Failed to update bill status:', err);
        alert('Failed to mark bill as Paid.');
      }
    }
  };

  const billActions = [
    {
      label: 'Print Bill',
      handler: handlePrintBill,
      style: { background: '#2980b9', color: 'white', borderRadius: '4px', border: 'none' },
    },
  ];

  const handleAddBill = (newBill) => {
    setBills(prev => [newBill, ...prev]);
  };

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <h1 className="text-2xl font-bold text-green-600 mb-4">Billing and Payments Manager</h1>

      <button
        onClick={() => setIsFormOpen(true)}
        className="mb-6 px-4 py-2 bg-yellow-400 hover:bg-yellow-300 rounded shadow font-semibold transition"
      >
        + Generate New Bill
      </button>

      {/* BillForm Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
          <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg relative">
            <BillForm onClose={() => setIsFormOpen(false)} onSubmit={handleAddBill} />
          </div>
        </div>
      )}

      {/* Bills DataTable */}
      <div className="overflow-x-auto">
        <DataTable title="Recent Bills" columns={billColumns} data={bills} actions={billActions} />
      </div>
    </div>
  );
};

export default BillingManagerPage;
