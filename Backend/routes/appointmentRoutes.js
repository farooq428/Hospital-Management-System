// routes/appointmentRoutes.js
import express from 'express';
import { protect, restrictTo } from '../middleware/authMiddleware.js';
import * as appointmentController from '../controllers/appointmentController.js';

const router = express.Router();

// 1. Create Appointment (Used by Receptionist, ties to PatientForm/AppointmentForm)
router.post(
    '/',
    protect,
    restrictTo('Receptionist'),
    appointmentController.createAppointment
);

// 2. Get All Appointments (for Receptionist manager view)
router.get(
    '/',
    protect,
    restrictTo('Receptionist', 'Admin'),
    appointmentController.getAllAppointments
);

// 3. Get Appointments for a Specific Doctor (for DoctorDashboard calendar)
router.get(
    '/doctor/:id',
    protect,
    restrictTo('Doctor', 'Admin'),
    appointmentController.getAppointmentsByDoctor
);

// 4. Update/Cancel Appointment (Used by Receptionist)
router.put(
    '/:id',
    protect,
    restrictTo('Receptionist'),
    appointmentController.updateAppointment
);

export default router;