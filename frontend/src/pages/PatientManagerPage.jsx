// src/pages/PatientManagerPage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from '../components/DataTable';
import { useAuth } from '../context/AuthContext';
import API from '../api/config';

const PatientManagerPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  const isReceptionist = user?.role === 'Receptionist';

  // ✅ Format DOB safely
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const dateObj = new Date(dateString);
    if (isNaN(dateObj.getTime())) return "N/A";
    return dateObj.toLocaleDateString("en-CA"); // YYYY-MM-DD
  };

  // Fetch patients
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await API.get('/patients');
        setPatients(res.data || []);
      } catch (err) {
        console.error('Failed to fetch patients:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  const handleViewProfile = (row) => {
    navigate(`/patients/${row.Patient_ID}`);
  };

  const handleRemovePatient = async (row) => {
    if (!window.confirm(`Are you sure you want to remove ${row.Name}?`)) return;

    try {
      await API.delete(`/patients/${row.Patient_ID}`);
      setPatients(prev => prev.filter(p => p.Patient_ID !== row.Patient_ID));
      alert(`${row.Name} has been removed.`);
    } catch (err) {
      console.error('Failed to remove patient:', err);
      alert('Failed to remove patient. Please try again.');
    }
  };

  // ✅ Prepare patients data with formatted DOB
  const formattedPatients = useMemo(
    () =>
      patients.map(p => ({
        ...p,
        formattedDOB: formatDate(p.DOB),
      })),
    [patients]
  );

  const patientActions = [
    {
      label: 'View',
      handler: handleViewProfile,
      style: 'bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm transition',
    },
    {
      label: 'Remove',
      handler: handleRemovePatient,
      style: 'bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-sm transition',
    },
  ];

  return (
    <div className="w-full p-4 sm:p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-600">Patient Manager</h1>
          <p className="text-gray-500 text-sm">View and manage all registered patients</p>
        </div>

        {isReceptionist && (
          <button
            onClick={() => navigate('/patients/new')}
            className="w-full md:w-auto px-6 py-2.5 rounded-lg bg-green-600 text-white font-medium
            hover:bg-green-700 transition shadow-md"
          >
            Add New Patient
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-3 sm:p-5 overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center min-h-[60vh] text-gray-600 text-lg">
            Loading patients...
          </div>
        ) : (
          <DataTable
            title="Registered Patients"
            data={formattedPatients}
            columns={[
              { header: 'Patient ID', accessor: 'Patient_ID' },
              { header: 'Name', accessor: 'Name' },
              { header: 'DOB', accessor: 'formattedDOB' }, // Use formatted DOB
              { header: 'Gender', accessor: 'Gender' },
              { header: 'Phone', accessor: 'Phone' },
            ]}
            actions={patientActions}
            actionButtonClass="px-3 py-1 rounded-lg text-sm transition"
          />
        )}
      </div>
    </div>
  );
};

export default PatientManagerPage;
