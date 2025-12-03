// src/components/forms/EmployeeForm.jsx
import React, { useState } from 'react';

// ⚠️ Mock Roles Data
const mockRoles = [
    { Role_ID: 1, Role_Name: 'Admin' },
    { Role_ID: 2, Role_Name: 'Doctor' },
    { Role_ID: 3, Role_Name: 'Receptionist' },
    { Role_ID: 4, Role_Name: 'Nurse' },
];

const EmployeeForm = ({ initialData, isEdit, onClose }) => {
    const [formData, setFormData] = useState({
        name: initialData?.Name || '',
        email: initialData?.Email || '',
        password: '', // Should only be required/editable when creating or explicitly resetting
        roleId: initialData?.Role_ID || 2, // Default to Doctor for testing
    });
    
    // Note: In a real app, you'd fetch the role list here

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        console.log('Submitting Employee Data:', formData);
        
        // API Call: POST or PUT /api/v1/employees
        
        alert(`Employee ${isEdit ? 'Updated' : 'Created'} Successfully!`);
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '15px' }}>
            <input name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
            <input name="email" type="email" placeholder="Email (Login ID)" value={formData.email} onChange={handleChange} required />
            
            {/* Password input is crucial for new accounts */}
            {!isEdit && (
                <input name="password" type="password" placeholder="Temporary Password" value={formData.password} onChange={handleChange} required={!isEdit} />
            )}
            
            {/* Role Selection (Connects to Role Entity) */}
            <select name="roleId" value={formData.roleId} onChange={handleChange} required>
                <option value="">Select Role</option>
                {mockRoles.map(role => (
                    <option key={role.Role_ID} value={role.Role_ID}>
                        {role.Role_Name}
                    </option>
                ))}
            </select>
            
            <button type="submit" style={{ padding: '10px', background: isEdit ? '#f39c12' : '#2ecc71', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '10px' }}>
                {isEdit ? 'Save Changes' : 'Create Employee'}
            </button>
        </form>
    );
};

export default EmployeeForm;