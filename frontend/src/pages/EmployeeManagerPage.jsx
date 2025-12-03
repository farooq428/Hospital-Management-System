// src/pages/EmployeeManagerPage.jsx (Mapped to /employees)
import React, { useState } from 'react';
import DataTable from '../components/DataTable';
import EmployeeForm from '../components/forms/EmployeeForm'; // To be created next
// import Modal from '../components/Modal'; // Assuming a reusable Modal component

const mockEmployees = [
    { Employee_ID: 1, Name: 'Dr. Gregory House', Role_Name: 'Doctor', Email: 'ghouse@easycare.com' },
    { Employee_ID: 2, Name: 'Nurse Alice', Role_Name: 'Nurse', Email: 'alice@easycare.com' },
    { Employee_ID: 3, Name: 'Bob Smith', Role_Name: 'Receptionist', Email: 'bob@easycare.com' },
    { Employee_ID: 4, Name: 'CEO Admin', Role_Name: 'Admin', Email: 'system@easycare.com' },
];

const EmployeeManagerPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState(null);

    const employeeColumns = [
        { header: 'ID', accessor: 'Employee_ID' },
        { header: 'Name', accessor: 'Name' },
        { header: 'Role', accessor: 'Role_Name' },
        { header: 'Email', accessor: 'Email' },
    ];
    
    const handleAddOrEdit = (employee = null) => {
        setEditingEmployee(employee);
        setIsModalOpen(true);
    };

    const employeeActions = [
        { 
            label: 'Edit', 
            handler: (row) => handleAddOrEdit(row),
            style: { background: '#f39c12', color: 'white', border: 'none', borderRadius: '4px' } 
        },
        { 
            label: 'Delete', 
            handler: (row) => alert(`Confirm deletion of ${row.Name}?`),
            style: { background: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px' } 
        },
    ];

    return (
        <div style={{ padding: '20px' }}>
            <h1 style={{ color: '#8e44ad' }}>Employee Management</h1>
            <button 
                onClick={() => handleAddOrEdit(null)}
                style={{ padding: '10px 15px', background: '#2ecc71', color: 'white', border: 'none', borderRadius: '4px', marginBottom: '20px' }}
            >
                + Add New Employee
            </button>
            
            <DataTable
                title="Current Staff Roster"
                columns={employeeColumns}
                data={mockEmployees}
                actions={employeeActions}
            />

            {/* Modal for adding/editing employees */}
            {/* {isModalOpen && (
                <Modal onClose={() => setIsModalOpen(false)} title={editingEmployee ? "Edit Employee" : "Add New Employee"}>
                    <EmployeeForm 
                        initialData={editingEmployee} 
                        isEdit={!!editingEmployee} 
                        onClose={() => setIsModalOpen(false)} 
                    />
                </Modal>
            )} */}
             {/* ⚠️ Placeholder until Modal is implemented */}
            {isModalOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div style={{ background: 'white', padding: '30px', borderRadius: '8px', width: '400px' }}>
                        <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px' }}>{editingEmployee ? "Edit Employee" : "Add New Employee"}</h3>
                        <EmployeeForm initialData={editingEmployee} isEdit={!!editingEmployee} onClose={() => setIsModalOpen(false)} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmployeeManagerPage;