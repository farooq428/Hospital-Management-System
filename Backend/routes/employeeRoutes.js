// routes/employeeRoutes.js
import express from 'express';
import { protect, restrictTo } from '../middleware/authMiddleware.js';
import * as employeeController from '../controllers/employeeController.js';

const router = express.Router();

// --- Role Endpoints ---

// 1. Get All Roles (Needed for EmployeeForm dropdown)
router.get(
    '/roles',
    protect,
    employeeController.getAllRoles // Protected, but not restricted, as other roles need to read it sometimes (e.g., Doctor for reference)
);

// --- Employee Endpoints ---

// 2. Create New Employee (Used by Admin)
router.post(
    '/',
    protect,
    restrictTo('Admin'),
    employeeController.createEmployee
);

// 3. Get All Employees (Used by Admin DataTable)
router.get(
    '/',
    protect,
    restrictTo('Admin'),
    employeeController.getAllEmployees
);

// 4. Update Employee (Name, Role, Email - Used by Admin)
router.put(
    '/:id',
    protect,
    restrictTo('Admin'),
    employeeController.updateEmployee
);

// 5. Delete Employee (Used by Admin)
router.delete(
    '/:id',
    protect,
    restrictTo('Admin'),
    employeeController.deleteEmployee
);

export default router;