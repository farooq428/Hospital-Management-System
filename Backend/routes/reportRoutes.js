// routes/reportRoutes.js
import express from 'express';
import { protect, restrictTo } from '../middleware/authMiddleware.js';
import * as reportController from '../controllers/reportController.js';

const router = express.Router();

// 1. Get Report History for a specific Patient (Used by PatientProfile)
router.get(
    '/patient/:id',
    protect,
    restrictTo('Doctor', 'Receptionist', 'Admin'),
    reportController.getReportsByPatient
);

// 2. Create/Log a New Test Report (Used by Lab/Admin to record a result)
router.post(
    '/',
    protect,
    restrictTo('Admin'), // Restrict creation to Admin/Lab role for system integrity
    reportController.createTestReport
);

export default router;