// backend/routes/dashboardRoutes.js
import express from 'express';
import { getAdminDashboardStats, getSystemLogs } from '../controllers/dashboardController.js';
const router = express.Router();

// Admin stats
router.get('/admin', getAdminDashboardStats);

// System logs
router.get('/logs', getSystemLogs);

export default router;
