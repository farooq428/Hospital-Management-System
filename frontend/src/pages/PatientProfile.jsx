// src/pages/PatientProfile.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar'; // Included for routing context

// Components for the Tabs
import DemographicsTab from '../components/patientProfile/DemographicsTab';
import PrescriptionHistoryTab from '../components/patientProfile/PrescriptionHistoryTab';
import TestReportHistoryTab from '../components/patientProfile/TestReportHistoryTab';
import BillingHistoryTab from '../components/patientProfile/BillingHistoryTab';

const PatientProfile = () => {
    // Get the patient ID from the URL: /patients/:id
    const { id: patientId } = useParams(); 
    const [patientData, setPatientData] = useState(null);
    const [activeTab, setActiveTab] = useState('Demographics'); // Default tab

    // ⚠️ MOCK Data Fetching
    useEffect(() => {
        // In a real application, this would be an API call: 
        // fetch(`/api/v1/patients/${patientId}/full-profile`)
        
        // --- MOCK API RESPONSE ---
        const mockData = {
            id: patientId,
            name: 'Elizabeth Swan',
            dob: '1985-05-15',
            age: 40,
            gender: 'Female',
            address: '456 Oak St, Cityville',
            phone: '555-1234',
            
            prescriptions: [ /* Mock prescription data */ ],
            reports: [ /* Mock report data */ ],
            bills: [ /* Mock bill data */ ],
            assignments: [ /* Mock room assignments */ ],
        };
        
        setPatientData(mockData);
    }, [patientId]);

    if (!patientData) {
        return <div style={{padding: '20px'}}>Loading Patient Data...</div>;
    }

    const tabs = [
        { name: 'Demographics', component: DemographicsTab, dataKey: null },
        { name: 'Prescriptions', component: PrescriptionHistoryTab, dataKey: 'prescriptions' },
        { name: 'Test Reports', component: TestReportHistoryTab, dataKey: 'reports' },
        { name: 'Billing', component: BillingHistoryTab, dataKey: 'bills' },
    ];
    
    // Dynamically select the component and data based on the activeTab
    const ActiveComponent = tabs.find(t => t.name === activeTab).component;
    const activeDataKey = tabs.find(t => t.name === activeTab).dataKey;
    const activeData = activeDataKey ? patientData[activeDataKey] : patientData;
    
    return (
        <div style={{ padding: '20px' }}>
            <h1 style={{color: '#2980b9'}}>{patientData.name} <small style={{fontSize: '0.6em', color: '#7f8c8d'}}>(ID: {patientId})</small></h1>
            <p>Patient Profile and Medical History</p>
            
            {/* Tab Navigation */}
            <div className="tab-nav" style={{ display: 'flex', borderBottom: '2px solid #ecf0f1', marginBottom: '20px' }}>
                {tabs.map((tab) => (
                    <button
                        key={tab.name}
                        onClick={() => setActiveTab(tab.name)}
                        style={{
                            padding: '10px 15px',
                            border: 'none',
                            borderBottom: activeTab === tab.name ? '3px solid #3498db' : 'none',
                            background: 'transparent',
                            cursor: 'pointer',
                            fontSize: '1em',
                            fontWeight: activeTab === tab.name ? 'bold' : 'normal',
                            color: activeTab === tab.name ? '#3498db' : '#2c3e50',
                            transition: 'color 0.3s, border-bottom 0.3s'
                        }}
                    >
                        {tab.name}
                    </button>
                ))}
            </div>
            
            {/* Tab Content */}
            <div className="tab-content">
                <ActiveComponent data={activeData} patientId={patientId} />
            </div>
        </div>
    );
};

export default PatientProfile;