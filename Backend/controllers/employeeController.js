import db from '../config/db.js';
import bcrypt from 'bcryptjs';

// --- Role Controllers ---

// @route GET /api/v1/employees/roles
// Fetches list of roles for the EmployeeForm dropdown.
// Excludes the 'Patient' role (Role_ID 4) as it's reserved for public self-registration.
export const getAllRoles = async (req, res) => {
    try {
        const [roles] = await db.query(
            `SELECT Role_ID, Role_Name 
             FROM Role 
             WHERE Role_Name != 'Patient' 
             ORDER BY Role_ID ASC`
        );
        res.status(200).json(roles);
    } catch (error) {
        console.error('Error fetching roles:', error);
        res.status(500).json({ message: 'Server error while fetching roles.' });
    }
};

// --- Employee Controllers ---

// @route POST /api/v1/employees
// Used by Admin to create a new employee account. Password is automatically hashed.
export const createEmployee = async (req, res) => {
    const { name, email, password, roleId } = req.body;

    if (!name || !email || !password || !roleId) {
        return res.status(400).json({ message: 'Missing required employee fields.' });
    }

    try {
        // 1. Hash the password before storing (using a salt factor of 10)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 2. Insert new employee record
        const [result] = await db.query(
            `INSERT INTO Employee (Name, Role_ID, Email, Password) VALUES (?, ?, ?, ?)`,
            [name, roleId, email, hashedPassword]
        );
        
        res.status(201).json({ 
            message: 'Employee account created successfully.', 
            employeeId: result.insertId 
        });

    } catch (error) {
        // Check for duplicate email error (MySQL error code 1062)
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Employee with this email already exists.' });
        }
        console.error('Error creating employee:', error);
        res.status(500).json({ message: 'Server error during employee creation.' });
    }
};

// @route GET /api/v1/employees
// Used by Admin to view all employees in the DataTable. Excludes Patient role data.
export const getAllEmployees = async (req, res) => {
    try {
        // Join with Role table to display the readable role name and filter out Patients
        const [employees] = await db.query(
            `SELECT E.Employee_ID, E.Name, E.Email, R.Role_Name, R.Role_ID 
             FROM Employee E
             JOIN Role R ON E.Role_ID = R.Role_ID
             WHERE R.Role_Name != 'Patient'
             ORDER BY E.Employee_ID ASC`
        );
        res.status(200).json(employees);
    } catch (error) {
        console.error('Error fetching employees:', error);
        res.status(500).json({ message: 'Server error while fetching employees.' });
    }
};

// @route PUT /api/v1/employees/:id
// Used by Admin to update employee details. Handles optional password change.
export const updateEmployee = async (req, res) => {
    const { id } = req.params;
    const { name, email, roleId, password } = req.body; // Added password for optional update

    if (!name && !email && !roleId && !password) {
        return res.status(400).json({ message: 'No fields provided for update.' });
    }

    // Build the query dynamically
    const setClauses = [];
    const params = [];
    
    if (name) { setClauses.push('Name = ?'); params.push(name); }
    if (email) { setClauses.push('Email = ?'); params.push(email); }
    if (roleId) { setClauses.push('Role_ID = ?'); params.push(roleId); }

    // Check if password is provided, and hash it if so
    if (password) {
        try {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            setClauses.push('Password = ?');
            params.push(hashedPassword);
        } catch (hashError) {
            console.error('Error hashing password during update:', hashError);
            return res.status(500).json({ message: 'Failed to securely update password.' });
        }
    }

    params.push(id); // Add Employee_ID for the WHERE clause

    try {
        const [result] = await db.query(
            `UPDATE Employee SET ${setClauses.join(', ')} WHERE Employee_ID = ?`,
            params
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Employee not found or no changes made.' });
        }

        res.status(200).json({ message: 'Employee updated successfully.' });
    } catch (error) {
        // Check for duplicate email error
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'This email is already in use by another account.' });
        }
        console.error('Error updating employee:', error);
        res.status(500).json({ message: 'Server error during employee update.' });
    }
};

// @route DELETE /api/v1/employees/:id
// Used by Admin to remove an employee
export const deleteEmployee = async (req, res) => {
    const { id } = req.params;

    try {
        // IMPORTANT: Ensure foreign key constraints are handled either by CASCADE DELETE 
        // in your DDL or by explicitly deleting dependent records (Appointments, Prescriptions) first.
        
        const [result] = await db.query(`DELETE FROM Employee WHERE Employee_ID = ?`, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Employee not found.' });
        }

        res.status(200).json({ message: 'Employee deleted successfully.' });
    } catch (error) {
        console.error('Error deleting employee:', error);
        res.status(500).json({ message: 'Server error during employee deletion. Check for dependent records.' });
    }
};