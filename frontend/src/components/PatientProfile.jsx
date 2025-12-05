// src/components/PatientProfile.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api/config';

const PatientProfile = () => {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const res = await API.get(`/patients/${id}`);
        setPatient(res.data);
      } catch (err) {
        console.error('Failed to fetch patient profile:', err);
        alert('Could not load patient profile. Check ID or permissions.');
      } finally {
        setLoading(false);
      }
    };
    fetchPatient();
  }, [id]);

  if (loading) return <p className="p-6">Loading patient data...</p>;
  if (!patient) return <p className="p-6">Patient not found.</p>;

  const tabs = ['profile', 'prescriptions', 'reports', 'billing'];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-blue-600 mb-4">{patient.Name}'s Profile</h1>
      
      {/* Tabs */}
      <div className="flex border-b border-gray-300 mb-4">
        {tabs.map(tab => (
          <button
            key={tab}
            className={`px-4 py-2 font-semibold ${
              activeTab === tab ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <p><strong>Patient ID:</strong> {patient.Patient_ID}</p>
            <p><strong>DOB:</strong> {patient.DOB}</p>
            <p><strong>Gender:</strong> {patient.Gender}</p>
            <p><strong>Phone:</strong> {patient.Phone}</p>
            <p className="sm:col-span-2"><strong>Address:</strong> {patient.Address}</p>
          </div>
        )}
        {activeTab === 'prescriptions' && (
          <ul className="list-disc pl-5">
            {patient.prescriptions?.map(p => (
              <li key={p.Prescription_ID}>{p.Medicines_List} ({p.Dosage}, {p.Duration})</li>
            )) || <p>No prescriptions.</p>}
          </ul>
        )}
        {activeTab === 'reports' && (
          <ul className="list-disc pl-5">
            {patient.reports?.map(r => (
              <li key={r.Report_ID}>{r.Type}: {r.Result}</li>
            )) || <p>No test reports.</p>}
          </ul>
        )}
        {activeTab === 'billing' && (
          <ul className="list-disc pl-5">
            {patient.bills?.map(b => (
              <li key={b.Bill_ID}>Amount: ${b.Amount} ({b.Status})</li>
            )) || <p>No bills.</p>}
          </ul>
        )}
      </div>
    </div>
  );
};

export default PatientProfile;
