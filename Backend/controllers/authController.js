// controllers/authController.js
import db from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Helper function to generate JWT
const generateToken = (id, roleName) => {
    return jwt.sign({ id, role: roleName }, process.env.JWT_SECRET, {
        expiresIn: '1d', // Token expires in 1 day
    });
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // SQL query to fetch employee details and their role name in one go
        const [rows] = await db.query(
            `SELECT E.Employee_ID, E.Password, R.Role_Name 
             FROM Employee E
             JOIN Role R ON E.Role_ID = R.Role_ID
             WHERE E.Email = ?`,
            [email]
        );

        const employee = rows[0];

        if (employee && (await bcrypt.compare(password, employee.Password))) {
            // Success: Password matches
            res.json({
                employeeId: employee.Employee_ID,
                role: employee.Role_Name,
                token: generateToken(employee.Employee_ID, employee.Role_Name),
            });
        } else {
            // Failure: User not found or password incorrect
            res.status(401).json({ message: 'Invalid credentials or user not found.' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login.' });
    }
};

// You will also need an initial script to hash and insert a few admin/doctor accounts into the DB manually 
// for initial testing, as the 'create employee' API endpoint isn't built yet.