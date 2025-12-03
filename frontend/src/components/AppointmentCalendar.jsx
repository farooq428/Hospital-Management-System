// src/components/AppointmentCalendar.jsx
import React, { useState, useEffect } from 'react';
// Later, you might use a library like 'react-big-calendar' or 'fullcalendar-react'

const AppointmentCalendar = ({ doctorId }) => {
    // ⚠️ Mock Appointments Data
    const [appointments, setAppointments] = useState([
        { id: 101, patientName: 'John Doe', time: '10:00 AM', reason: 'Annual Checkup', status: 'Confirmed' },
        { id: 102, patientName: 'Jane Smith', time: '11:30 AM', reason: 'Follow-up on Lab Results', status: 'Confirmed' },
        { id: 103, patientName: 'Mike Johnson', time: '02:00 PM', reason: 'Fever and Cough', status: 'Pending' },
    ]);
    const [selectedDate, setSelectedDate] = useState(new Date().toDateString());

    // In the real application, useEffect would fetch appointments from the backend
    useEffect(() => {
        // Fetch appointments for the doctorId and selectedDate
        console.log(`Fetching appointments for Doctor ID: ${doctorId} on ${selectedDate}`);
    }, [doctorId, selectedDate]);


    return (
        <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ margin: 0 }}>Appointments for {selectedDate}</h4>
                {/* Date Picker Placeholder */}
                <input 
                    type="date" 
                    onChange={(e) => setSelectedDate(new Date(e.target.value).toDateString())} 
                    style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} 
                />
            </div>

            {/* Appointment List */}
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {appointments.length === 0 ? (
                    <p>No appointments scheduled for this date.</p>
                ) : (
                    appointments.map((appt) => (
                        <li key={appt.id} style={{ 
                            padding: '10px 0', 
                            borderBottom: '1px solid #eee', 
                            display: 'flex', 
                            justifyContent: 'space-between' 
                        }}>
                            <div>
                                <strong>{appt.time}</strong> - {appt.patientName}
                                <span style={{ marginLeft: '10px', fontSize: '0.8em', color: '#888' }}>
                                    ({appt.reason})
                                </span>
                            </div>
                            <span style={{ 
                                background: appt.status === 'Confirmed' ? '#e6ffe6' : '#fff0b3', 
                                color: appt.status === 'Confirmed' ? '#006600' : '#b38f00',
                                padding: '3px 8px', 
                                borderRadius: '4px' 
                            }}>
                                {appt.status}
                            </span>
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
};

export default AppointmentCalendar;