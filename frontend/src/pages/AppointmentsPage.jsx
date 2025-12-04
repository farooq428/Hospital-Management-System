// src/pages/AppointmentsPage.jsx (COMPLETE FILE)
import React, { useState, useEffect } from 'react';
import DataTable from '../components/DataTable';
import AppointmentForm from '../components/forms/AppointmentForm'; // Assuming you create this form
import { useAuth } from '../context/AuthContext';
import API from '../api/config'; // API Import

const AppointmentsPage = () => {
    const { user } = useAuth();
    const isReceptionist = user?.role === 'Receptionist';
    
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchAppointments = async () => {
        try {
            // Receptionist fetches all appointments for full oversight
            const response = await API.get('/appointments');
            setAppointments(response.data);
        } catch (error) {
            console.error('Failed to fetch appointments:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    const appointmentColumns = [
        { header: 'ID', accessor: 'Appointment_ID' },
        { header: 'Date', accessor: 'Date' },
        { header: 'Time', accessor: 'Time' },
        { header: 'Patient', accessor: 'Patient_Name' },
        { header: 'Doctor', accessor: 'Doctor_Name' },
        { header: 'Reason', accessor: 'Reason' },
    ];
    
    // Action handler (e.g., for updating/cancelling)
    const handleAction = (row, action) => {
        alert(`${action} appointment ID: ${row.Appointment_ID}`);
        // In a real app, this would trigger PUT /appointments/:id
    };

    const appointmentActions = [
        { 
            label: 'Cancel', 
            handler: (row) => handleAction(row, 'Cancelling'),
            style: { background: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px' } 
        },
    ];

    if (loading) return <div style={{ padding: '20px' }}>Loading Appointments...</div>;

    return (
        <div style={{ padding: '20px' }}>
            <h1 style={{ color: '#3498db' }}>Appointment Manager</h1>
            
            {isReceptionist && (
                <button 
                    onClick={() => setIsModalOpen(true)}
                    style={{ padding: '10px 15px', background: '#2ecc71', color: 'white', border: 'none', borderRadius: '4px', marginBottom: '20px' }}
                >
                    + Book New Appointment
                </button>
            )}
            
            <DataTable
                title="All Scheduled Appointments"
                columns={appointmentColumns}
                data={appointments}
                actions={appointmentActions}
            />

             {/* Appointment Booking Modal */}
             {isModalOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div style={{ background: 'white', padding: '30px', borderRadius: '8px', width: '400px' }}>
                        <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px' }}>Book New Appointment</h3>
                        <AppointmentForm 
                            onClose={() => {setIsModalOpen(false); fetchAppointments();}} // Re-fetch list on close
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default AppointmentsPage;