import React, { useState, useEffect } from 'react';
import DataTable from '../components/DataTable';
import EmployeeForm from '../components/forms/EmployeeForm';
import API from '../api/config';

const EmployeeManagerPage = () => {
  const [employees, setEmployees] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  // Fetch active employees
  const fetchEmployees = async () => {
    try {
      const response = await API.get('/employees');
      setEmployees(response.data);
    } catch (error) {
      console.error('Failed to fetch employees:', error);
      alert('Error fetching employees');
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleAddOrEdit = (employee = null) => {
    setEditingEmployee(employee);
    setIsModalOpen(true);
  };

  const handleDelete = async (row) => {
    if (window.confirm(`Mark employee ${row.Name} as inactive?`)) {
      try {
        await API.delete(`/employees/${row.Employee_ID}`);
        alert('Employee has been marked as inactive.');
        fetchEmployees();
      } catch (error) {
        console.error('Delete failed:', error);
        alert(error.response?.data?.message || 'Failed to delete employee.');
      }
    }
  };

  const employeeColumns = [
    { header: 'ID', accessor: 'Employee_ID' },
    { header: 'Name', accessor: 'Name' },
    { header: 'Role', accessor: 'Role_Name' },
    { header: 'Email', accessor: 'Email' },
  ];

  const employeeActions = [
    {
      label: 'Edit',
      handler: handleAddOrEdit,
      style: { background: '#f39c12', color: 'white', border: 'none', borderRadius: '4px' }
    },
    {
      label: 'Delete',
      handler: handleDelete,
      style: { background: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px' }
    }
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-purple-700 mb-4">Employee Management</h1>
      <button
        onClick={() => handleAddOrEdit(null)}
        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl mb-6 transition duration-300"
      >
        + Add New Employee
      </button>

      <DataTable
        title="Current Staff Roster"
        columns={employeeColumns}
        data={employees}
        actions={employeeActions}
      />

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl w-full max-w-md">
            <h3 className="text-lg font-semibold border-b pb-2 mb-4">
              {editingEmployee ? 'Edit Employee' : 'Add New Employee'}
            </h3>
            <EmployeeForm
              employeeData={editingEmployee}
              onClose={() => {
                setIsModalOpen(false);
                fetchEmployees();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeManagerPage;
