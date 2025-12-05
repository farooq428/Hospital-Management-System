import express from 'express';
import {
  getAdminDashboardStats,
  getReceptionistDashboardStats,
  getDoctorDashboardStats,
  getSystemLogs,
} from '../controllers/dashboardController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

// ============================
// Admin dashboard
// ============================
router.get('/admin', protect, restrictTo('Admin'), getAdminDashboardStats);

// ============================
// Receptionist dashboard
// ============================
router.get('/receptionist', protect, restrictTo('Receptionist'), getReceptionistDashboardStats);

// ============================
// Doctor dashboard
// ============================
router.get('/doctor', protect, restrictTo('Doctor'), getDoctorDashboardStats);

// ============================
// System logs
// ============================
router.get('/logs', protect, restrictTo('Admin'), getSystemLogs);

export default router;
