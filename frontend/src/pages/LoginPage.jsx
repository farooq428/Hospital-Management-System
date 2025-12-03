// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
// Assuming you created a reusable input component, otherwise use <input>
// import CustomInput from '../components/CustomInput'; 
// import PrimaryButton from '../components/PrimaryButton';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, getRole } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // 1. Attempt Mock Login
        const success = login(email, password);

        if (success) {
            // 2. Get the role and determine the dashboard path
            const role = getRole(); 
            let redirectPath = '/login'; // Default fallback

            // Redirect based on the role retrieved from the mock login
            if (role === 'Admin') {
                redirectPath = '/admin';
            } else if (role === 'Doctor') {
                redirectPath = '/doctor';
            } else if (role === 'Receptionist') {
                redirectPath = '/receptionist';
            }
            
            // 3. Navigate to the appropriate dashboard
            navigate(redirectPath);
        } else {
            alert('Invalid Credentials. Try admin@easycare.com, reception@easycare.com, or system@easycare.com');
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f4f7f6' }}>
            <div style={{ width: 400, padding: 40, background: 'white', borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <h2 style={{ textAlign: 'center', marginBottom: 30, color: '#3498db' }}>EasyCare Hospital Login</h2>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: 15 }}>
                        {/* Replace with <CustomInput> later for styling consistency */}
                        <label>Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{ width: '100%', padding: '10px', marginTop: '5px', border: '1px solid #ccc', borderRadius: '4px' }}
                        />
                    </div>
                    <div style={{ marginBottom: 20 }}>
                        <label>Password:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{ width: '100%', padding: '10px', marginTop: '5px', border: '1px solid #ccc', borderRadius: '4px' }}
                        />
                    </div>
                    <button 
                        type="submit" 
                        style={{ width: '100%', padding: '12px', background: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;