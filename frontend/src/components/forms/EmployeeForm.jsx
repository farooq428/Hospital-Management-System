// src/components/forms/EmployeeForm.jsx
import React, { useState, useEffect } from 'react';
import API from '../../api/config';

const EmployeeForm = ({ employeeData, onClose }) => {
    const [name, setName] = useState(employeeData?.Name || '');
    const [email, setEmail] = useState(employeeData?.Email || '');
    const [password, setPassword] = useState('');
    const [roleId, setRoleId] = useState(employeeData?.Role_ID || 2); // Default to Doctor
    const [roles, setRoles] = useState([]);
    const isEditMode = !!employeeData;

    // Fetch available roles from the database
    useEffect(() => {
        const fetchRoles = async () => {
            try {
                // Assuming you create an API endpoint: GET /api/v1/roles
                const response = await API.get('/roles');
                setRoles(response.data);
            } catch (error) {
                console.error('Failed to fetch roles:', error);
            }
        };
        fetchRoles();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const payload = { 
            Name: name, 
            Email: email, 
            Role_ID: roleId,
            Password: password || undefined // Only include password if provided/new
        };
        
        try {
            if (isEditMode) {
                // Calls PUT /api/v1/employees/:id
                await API.put(`/employees/${employeeData.Employee_ID}`, payload);
                alert(`Employee ${name} updated successfully.`);
            } else {
                if (!password) {
                    alert('Password is required for new employees.');
                    return;
                }
                // Calls POST /api/v1/employees (This route will hash the password)
                await API.post('/employees', payload);
                alert(`New employee ${name} created successfully.`);
            }
            onClose(); // Close modal and refresh list
        } catch (error) {
            alert(`Error: ${error.response?.data?.message || 'Failed to save employee.'}`);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '15px' }}>
            <div>
                <label>Name:</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div>
                <label>Email:</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required={!isEditMode} disabled={isEditMode} />
            </div>
            <div>
                <label>Role:</label>
                <select value={roleId} onChange={(e) => setRoleId(e.target.value)} required>
                    {roles.filter(r => r.Role_Name !== 'Patient').map(role => (
                        <option key={role.Role_ID} value={role.Role_ID}>
                            {role.Role_Name}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label>{isEditMode ? 'New Password (optional):' : 'Password:'}</label>
                {/* Note: Password field must be available to hash on creation */}
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required={!isEditMode} />
            </div>
            <button type="submit" style={{ padding: '10px', background: '#3498db', color: 'white' }}>
                {isEditMode ? 'Update Employee' : 'Create Employee'}
            </button>
        </form>
    );
};

export default EmployeeForm;