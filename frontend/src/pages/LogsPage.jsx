// src/pages/LogsPage.jsx
import React, { useEffect, useState } from 'react';
import API from '../api/config';

const LogsPage = () => {
  const [logs, setLogs] = useState([]);

  const fetchLogs = async () => {
    try {
      const response = await API.get('/dashboard/logs');
      setLogs(response.data);
    } catch (error) {
      console.error('Failed to fetch logs:', error);
      alert('Error fetching logs');
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-purple-700 mb-4">System Logs</h1>

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">ID</th>
            <th className="border p-2">Action</th>
            <th className="border p-2">User</th>
            <th className="border p-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {logs.map(log => (
            <tr key={log.id}>
              <td className="border p-2">{log.id}</td>
              <td className="border p-2">{log.action}</td>
              <td className="border p-2">{log.user}</td>
              <td className="border p-2">{new Date(log.date).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LogsPage;
