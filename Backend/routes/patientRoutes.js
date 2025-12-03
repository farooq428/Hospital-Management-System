// routes/patientRoutes.js
import express from 'express';
import { protect, restrictTo } from '../middleware/authMiddleware.js';
import * as patientController from '../controllers/patientController.js';

const router = express.Router();

// 1. Get ALL Patients (Used by Doctor/Receptionist DataTable)
router.get(
    '/', 
    protect, 
    restrictTo('Doctor', 'Receptionist', 'Admin'), 
    patientController.getAllPatients
);

// 2. Register New Patient (Used by Receptionist)
router.post(
    '/', 
    protect, 
    restrictTo('Receptionist'), 
    patientController.createPatient
);

// 3. Get Patient by ID (Used by Doctor/Receptionist for PatientProfile)
router.get(
    '/:id', 
    protect, 
    restrictTo('Doctor', 'Receptionist', 'Admin'), 
    patientController.getPatientById
);

// 4. Update Patient Details (Used by Receptionist)
router.put(
    '/:id', 
    protect, 
    restrictTo('Receptionist'), 
    patientController.updatePatient
);

export default router;