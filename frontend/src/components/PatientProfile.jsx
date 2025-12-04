// src/components/PatientProfile.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api/config'; // <-- Import API
// ... Import Tabs (e.g., PrescriptionHistoryTab, BillHistoryTab, etc.)

const PatientProfile = () => {
    const { id } = useParams(); // Patient_ID from the URL
    const [patient, setPatient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('profile');

    useEffect(() => {
        const fetchPatientProfile = async () => {
            try {
                // Calls GET /api/v1/patients/:id - which returns patient + nested data
                const response = await API.get(`/patients/${id}`);
                setPatient(response.data);
            } catch (error) {
                console.error('Failed to fetch patient profile:', error);
                alert('Could not load patient profile. Check ID or permissions.');
            } finally {
                setLoading(false);
            }
        };
        fetchPatientProfile();
    }, [id]);

    if (loading) return <div style={{ padding: '20px' }}>Loading Patient Data...</div>;
    if (!patient) return <div style={{ padding: '20px' }}>Patient Not Found.</div>;

    const renderTabContent = () => {
        switch (activeTab) {
            case 'prescriptions':
                // Pass prescriptions array fetched from the API
                return <PrescriptionHistoryTab data={patient.prescriptions} />;
            case 'reports':
                // Pass reports array fetched from the API
                return <TestReportHistoryTab data={patient.reports} />;
            case 'billing':
                // Pass bills array fetched from the API
                return <BillHistoryTab data={patient.bills} />;
            case 'profile':
            default:
                return (
                    <div className="profile-details" style={{ background: '#f9f9f9', padding: '20px', borderRadius: '4px' }}>
                        <h3>Demographics</h3>
                        <p><strong>Patient ID:</strong> {patient.Patient_ID}</p>
                        <p><strong>Date of Birth:</strong> {patient.DOB}</p>
                        <p><strong>Gender:</strong> {patient.Gender}</p>
                        <p><strong>Phone:</strong> {patient.Phone}</p>
                        <p><strong>Address:</strong> {patient.Address}</p>
                    </div>
                );
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1 style={{ color: '#3498db' }}>Patient Profile: {patient.Name}</h1>
            
            <div className="tabs" style={{ display: 'flex', borderBottom: '1px solid #ccc', marginBottom: '20px' }}>
                {/* Tab buttons here, onClick should call setActiveTab(...) */}
            </div>
            
            {renderTabContent()}
        </div>
    );
};

export default PatientProfile;