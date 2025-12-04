// src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/config'; // Used to fetch public doctor data

const HomePage = () => {
    const navigate = useNavigate();
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // NOTE: You would need to create a PUBLIC backend route (e.g., GET /public/doctors) 
        // that does NOT require a JWT token to fetch basic Doctor Name/Specialty.
        const fetchPublicDoctors = async () => {
            try {
                // Assuming you create an unprotected endpoint for marketing data
                const response = await API.get('/public/doctors'); 
                setDoctors(response.data);
            } catch (error) {
                console.error("Failed to fetch doctor list publicly.", error);
                // Use fallback data if API fails
                setDoctors([
                    { id: 101, name: "Dr. House", specialty: "Diagnostic Medicine", description: "World-renowned diagnostician." },
                    { id: 102, name: "Dr. Smith", specialty: "Cardiology", description: "Specializes in complex heart conditions." },
                ]);
            } finally {
                setLoading(false);
            }
        };
        fetchPublicDoctors();
    }, []);
    
    // Function to handle the transition to a protected page
    const handleProtectedAction = (action) => {
        // Redirects to login, where the user will be sent back to the desired page after authentication
        if (action === 'appointment') {
            navigate('/login', { state: { from: '/appointments/book' } }); 
        } else {
            navigate('/login');
        }
    };

    return (
        <div style={{ padding: '20px', minHeight: '100vh', background: '#f8f9fa' }}>
            <header style={styles.header}>
                <h1 style={{ margin: 0 }}>EasyCare Hospital System</h1>
                {/* Public Navigation */}
                <nav>
                    <button onClick={() => navigate('/')} style={styles.navButton}>Home</button>
                    <button onClick={() => handleProtectedAction('appointment')} style={styles.navButton}>Book Appointment</button>
                    <button onClick={() => navigate('/login')} style={styles.navButton}>Staff Login</button>
                </nav>
            </header>

            <h2 style={styles.sectionTitle}>Meet Our Specialists 👩‍⚕️</h2>
            <div style={styles.doctorGrid}>
                {loading ? <p>Loading doctor profiles...</p> : doctors.map(doctor => (
                    <div key={doctor.id} style={styles.doctorCard}>
                        <h3>{doctor.name}</h3>
                        <p style={styles.specialty}>{doctor.specialty}</p>
                        <p>{doctor.description}</p>
                        <button 
                            onClick={() => handleProtectedAction('appointment')} 
                            style={styles.actionButton}
                        >
                            Select & Book
                        </button>
                    </div>
                ))}
            </div>

            <h2 style={styles.sectionTitle}>Our Services</h2>
            <p style={{textAlign: 'center', marginBottom: '40px'}}>For staff access (Patient Records, Billing, Room Management), please use the Staff Login.</p>
        </div>
    );
};

const styles = {
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '15px 0',
        borderBottom: '1px solid #eee',
        marginBottom: '40px',
    },
    navButton: {
        marginLeft: '15px',
        padding: '8px 15px',
        background: '#3498db',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    sectionTitle: {
        textAlign: 'center',
        margin: '40px 0 20px',
        color: '#2c3e50',
    },
    doctorGrid: {
        display: 'flex',
        justifyContent: 'center',
        gap: '30px',
        marginBottom: '60px',
        flexWrap: 'wrap',
    },
    doctorCard: {
        padding: '25px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        width: '300px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
        textAlign: 'center',
        background: 'white',
    },
    specialty: {
        color: '#e67e22',
        fontWeight: 'bold',
        marginBottom: '10px',
    },
    actionButton: {
        marginTop: '15px',
        padding: '10px 20px',
        background: '#2ecc71',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
};

export default HomePage;