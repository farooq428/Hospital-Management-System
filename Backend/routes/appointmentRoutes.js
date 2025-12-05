// routes/appointmentRoutes.js
import express from 'express';
import { protect, restrictTo } from '../middleware/authMiddleware.js';
import * as appointmentController from '../controllers/appointmentController.js';

const router = express.Router();

// 1. Create Appointment (Receptionist)
router.post(
    '/',
    protect,
    restrictTo('Receptionist'),
    appointmentController.createAppointment
);

// 2. Get All Appointments (Receptionist + Admin)
router.get(
    '/',
    protect,
    restrictTo('Receptionist', 'Admin'),
    appointmentController.getAllAppointments
);

// 3. Get Appointments for a Specific Doctor (Doctor + Admin)
router.get(
    '/doctor/:id',
    protect,
    restrictTo('Doctor', 'Admin'),
    appointmentController.getAppointmentsByDoctor
);

// 4. Update Appointment (Receptionist)
router.put(
    '/:id',
    protect,
    restrictTo('Receptionist'),
    appointmentController.updateAppointment
);

// ✅ 5. DELETE / Cancel Appointment (Receptionist) ✅✅✅
router.delete(
    '/:id',
    protect,
    restrictTo('Receptionist'),
    appointmentController.deleteAppointment
);

export default router;
