// src/components/forms/PatientForm.jsx
import React, { useState } from 'react';
import API from '../../api/config';

const PatientForm = ({ initialData = {}, isEdit = false, onSuccess }) => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await API.put(`/patients/${initialData.Patient_ID}`, formData);
        alert('Patient details updated successfully!');
      } else {
        await API.post('/patients', formData);
        alert('New Patient Registered Successfully!');
        setFormData({ name: '', dob: '', gender: '', address: '', phone: '' });
      }
      if (onSuccess) onSuccess(); // Refresh table if needed
    } catch (error) {
      console.error('Submission failed:', error.response?.data || error.message);
      alert(`Error: ${error.response?.data?.message || 'Could not save data.'}`);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 sm:p-8 rounded-2xl shadow-md max-w-3xl mx-auto space-y-4"
    >
      <h2 className="text-xl font-bold text-gray-700 mb-4">
        {isEdit ? 'Edit Patient' : 'Register New Patient'}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          name="dob"
          type="date"
          value={formData.dob}
          onChange={handleChange}
          required
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          required
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        <input
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          required
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <textarea
        name="address"
        placeholder="Address"
        value={formData.address}
        onChange={handleChange}
        required
        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <button
        type="submit"
        className={`w-full sm:w-auto px-6 py-2 rounded-lg text-white font-semibold transition ${
          isEdit ? 'bg-orange-500 hover:bg-orange-600' : 'bg-green-600 hover:bg-green-700'
        }`}
      >
        {isEdit ? 'Save Changes' : 'Register Patient'}
      </button>
    </form>
  );
};

export default PatientForm;
