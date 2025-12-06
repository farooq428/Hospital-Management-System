// backend/routes/appointmentRoutes.js
import express from 'express';
import { protect, restrictTo } from '../middleware/authMiddleware.js';
import * as appointmentController from '../controllers/appointmentController.js';

const router = express.Router();

// ✅ 1. Create Appointment (Receptionist)
router.post(
  '/',
  protect,
  restrictTo('Receptionist'),
  appointmentController.createAppointment
);

// ✅ 2. Get All Appointments (NOW: Receptionist + Admin + Doctor ✅)
router.get(
  '/',
  protect,
  restrictTo('Receptionist', 'Admin', 'Doctor'), // ✅ FIXED HERE
  appointmentController.getAllAppointments
);

// ✅ 3. Get Doctor Appointments (Doctor + Admin)
router.get(
  '/doctor/:id',
  protect,
  restrictTo('Doctor', 'Admin'),
  appointmentController.getAppointmentsByDoctor
);

// ✅ 4. Update Appointment (Receptionist)
router.put(
  '/:id',
  protect,
  restrictTo('Receptionist'),
  appointmentController.updateAppointment
);

// ✅ 5. Delete / Cancel Appointment (Receptionist)
router.delete(
  '/:id',
  protect,
  restrictTo('Receptionist'),
  appointmentController.deleteAppointment
);

router.put(
  '/cancel/:id',
  protect,
  restrictTo('Receptionist'),
  appointmentController.cancelAppointment   // ✅ NEW CONTROLLER
);

export default router;
