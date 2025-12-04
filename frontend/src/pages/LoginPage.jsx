// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
// import CustomInput from '../components/CustomInput'; 
// import PrimaryButton from '../components/PrimaryButton';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(''); // State to hold API error message
    
    // --- CORRECTION 1: Only need the 'login' function ---
    const { login } = useAuth(); 
    const navigate = useNavigate();

    // --- CORRECTION 2: handleSubmit must be asynchronous (async) ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors

        // 1. Attempt API Login
        // The 'login' function returns true on success, or the error message on failure
        const result = await login(email, password);

        if (result === true) {
            // 2. Login was successful. We don't need manual redirection here
            // because App.jsx has a <Navigate to="/" /> on successful login,
            // and the '/' route then redirects based on the user's role.
            // However, a slight delay helps context update:
            navigate('/');
        } else {
            // 3. Login failed (result contains the error message from the AuthContext)
            setError(result || 'Invalid credentials or server error.');
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f4f7f6' }}>
            <div style={{ width: 400, padding: 40, background: 'white', borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <h2 style={{ textAlign: 'center', marginBottom: 30, color: '#3498db' }}>EasyCare Hospital Login</h2>
                
                {/* Display Error Message */}
                {error && (
                    <div style={{ color: '#e74c3c', textAlign: 'center', marginBottom: 15, padding: '10px', border: '1px solid #e74c3c', borderRadius: '4px', background: '#fdd' }}>
                        {error}
                    </div>
                )}
                
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: 15 }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                        />
                    </div>
                    <div style={{ marginBottom: 20 }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Password:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                        />
                    </div>
                    <button 
                        type="submit" 
                        style={{ width: '100%', padding: '12px', background: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                        Login
                    </button>
                    
                    <p style={{ marginTop: '20px', fontSize: '0.85em', color: '#7f8c8d', textAlign: 'center' }}>
                        **Test Credentials:** admin@easycare.com, house@easycare.com, penny@easycare.com (Password: password123)
                    </p>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;