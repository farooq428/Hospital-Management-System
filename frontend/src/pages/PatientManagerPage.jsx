// src/pages/PatientManagerPage.jsx
import React, { useState, useEffect } from 'react';
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

  // Fetch patients
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await API.get('/patients');
        setPatients(res.data);
      } catch (err) {
        console.error('Failed to fetch patients:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  // View profile handler
  const handleViewProfile = (row) => {
    navigate(`/patients/${row.Patient_ID}`);
  };

  const patientActions = [
    {
      label: 'View',
      handler: handleViewProfile,
      style: '' // Tailwind styles handled in DataTable component
    }
  ];

  return (
    <div className="w-full p-4 sm:p-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-600">
            Patient Manager
          </h1>
          <p className="text-gray-500 text-sm">
            View and manage all registered patients
          </p>
        </div>

        {isReceptionist && (
          <button
            onClick={() => navigate('/patients/new')}
            className="w-full md:w-auto px-6 py-2.5 rounded-lg bg-green-600 text-white font-medium
            hover:bg-green-700 transition shadow-md"
          >
            + Add New Patient
          </button>
        )}
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-3 sm:p-5">
        {loading ? (
          <div className="flex items-center justify-center min-h-[60vh] text-gray-600 text-lg">
            Loading patients...
          </div>
        ) : (
          <DataTable
            title="Registered Patients"
            data={patients}
            columns={[
              { header: 'Patient ID', accessor: 'Patient_ID' },
              { header: 'Name', accessor: 'Name' },
              { header: 'DOB', accessor: 'DOB' },
              { header: 'Gender', accessor: 'Gender' },
              { header: 'Phone', accessor: 'Phone' },
            ]}
            actions={patientActions}
            actionButtonClass="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition"
          />
        )}
      </div>
    </div>
  );
};

export default PatientManagerPage;
