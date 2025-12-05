// src/pages/NewPatient.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/config';

const NewPatient = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    gender: '',
    address: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await API.post('/patients', formData);
      alert('Patient registered successfully!');
      navigate('/patients');
    } catch (err) {
      console.error('Failed to register patient:', err);
      setError(err.response?.data?.message || 'Server error during patient registration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md mt-6">
      <h2 className="text-2xl font-bold text-blue-600 mb-4">Register New Patient</h2>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="border-gray-300 border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="date"
          name="dob"
          value={formData.dob}
          onChange={handleChange}
          required
          className="border-gray-300 border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          required
          className="border-gray-300 border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          required
          className="border-gray-300 border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          required
          className="border-gray-300 border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          {loading ? 'Registering...' : 'Register Patient'}
        </button>
      </form>
    </div>
  );
};

export default NewPatient;
