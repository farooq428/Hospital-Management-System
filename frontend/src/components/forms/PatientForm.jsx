// src/components/forms/PatientForm.jsx
import React, { useState } from 'react';
import API from '../../api/config'; // <-- Import API

const PatientForm = ({ initialData = {}, isEdit = false }) => {
    const [formData, setFormData] = useState({
        name: initialData.Name || '',
        dob: initialData.DOB || '',
        gender: initialData.Gender || '',
        address: initialData.Address || '',
        phone: initialData.Phone || '',
    });
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => { // <-- Made async
        e.preventDefault();
        
        try {
            if (isEdit) {
                // PUT /api/v1/patients/:id
                await API.put(`/patients/${initialData.Patient_ID}`, formData);
                alert('Patient details updated successfully!');
            } else {
                // POST /api/v1/patients
                await API.post('/patients', formData);
                alert('New Patient Registered Successfully!');
                // Clear form
                setFormData({ name: '', dob: '', gender: '', address: '', phone: '' }); 
            }
        } catch (error) {
            console.error('Submission failed:', error.response?.data || error.message);
            alert(`Error: ${error.response?.data?.message || 'Could not save data.'}`);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ background: '#fff', padding: '30px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <input name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
                <input name="dob" type="date" placeholder="Date of Birth" value={formData.dob} onChange={handleChange} required />
                
                <select name="gender" value={formData.gender} onChange={handleChange} required>
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                </select>
                
                <input name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required />
            </div>
            
            <input name="address" placeholder="Address" value={formData.address} onChange={handleChange} style={{ width: '100%', marginBottom: '20px' }} required />
            
            <button type="submit" style={{ padding: '10px 20px', background: isEdit ? '#f39c12' : '#2ecc71', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                {isEdit ? 'Save Changes' : 'Register Patient'}
            </button>
        </form>
    );
};

export default PatientForm;