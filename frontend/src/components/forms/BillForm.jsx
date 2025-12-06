import React, { useState, useEffect } from 'react';
import API from '../../api/config';

const BillForm = ({ onClose, onSubmit }) => {
  const [patients, setPatients] = useState([]);
  const [formData, setFormData] = useState({
    patientId: '',
    amount: '',
    description: '',
  });
  const [loading, setLoading] = useState(true);

  // Fetch patients from backend
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await API.get('/patients'); // Adjust API if needed
        setPatients(res.data);
      } catch (err) {
        console.error('Failed to fetch patients:', err);
        alert('Failed to load patients.');
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.patientId || !formData.amount) {
      alert('Please select a patient and enter an amount.');
      return;
    }

    try {
      const res = await API.post('/bills', {
        patientId: formData.patientId,
        amount: parseFloat(formData.amount),
      });

      alert(`Bill generated successfully! Bill ID: ${res.data.billId}`);

      // Pass new bill info to parent component
      if (onSubmit) {
        const patientName = patients.find(p => p.Patient_ID === parseInt(formData.patientId))?.Name || '';
        const newBill = {
          Bill_ID: res.data.billId,
          Patient_ID: parseInt(formData.patientId),
          Patient_Name: patientName,
          Date: new Date().toISOString().split('T')[0],
          Amount: parseFloat(formData.amount),
          Status: 'Pending',
        };
        onSubmit(newBill);
      }

      onClose();
    } catch (err) {
      console.error('Failed to generate bill:', err);
      alert('Failed to generate bill. Please try again.');
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Generate Bill</h2>
      <form onSubmit={handleSubmit} className="grid gap-4">
        {/* Patient Selection */}
        <div>
          <label className="block mb-1 font-medium">Select Patient:</label>
          {loading ? (
            <p>Loading patients...</p>
          ) : (
            <select
              name="patientId"
              value={formData.patientId}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select Patient</option>
              {patients.map(p => (
                <option key={p.Patient_ID} value={p.Patient_ID}>
                  {p.Name} (ID: {p.Patient_ID})
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Amount Input */}
        <div>
          <label className="block mb-1 font-medium">Bill Amount ($):</label>
          <input
            name="amount"
            type="number"
            step="0.01"
            placeholder="e.g., 250.75"
            value={formData.amount}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block mb-1 font-medium">Description (Optional)</label>
          <textarea
            name="description"
            rows="3"
            placeholder="e.g., Consultation Fee, Lab Work, Medication"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2 mt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
          >
            Close
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
          >
            Generate Invoice
          </button>
        </div>
      </form>
    </div>
  );
};

export default BillForm;
