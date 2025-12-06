import express from 'express';
import { protect, restrictTo } from '../middleware/authMiddleware.js';
import * as patientController from '../controllers/patientController.js';

const router = express.Router();

// 1. Get ALL Patients
router.get(
    '/', 
    protect, 
    restrictTo('Doctor', 'Receptionist', 'Admin'), 
    patientController.getAllPatients
);

// 2. Register New Patient
router.post(
    '/', 
    protect, 
    restrictTo('Receptionist'), 
    patientController.createPatient
);

// 3. Get Patient by ID
router.get(
    '/:id', 
    protect, 
    restrictTo('Doctor', 'Receptionist', 'Admin'), 
    patientController.getPatientById
);

// 4. Update Patient Details
router.put(
    '/:id', 
    protect, 
    restrictTo('Receptionist'), 
    patientController.updatePatient
);

// 5. DELETE Patient (New) ✅
router.delete(
    '/:id',
    protect,
    restrictTo('Receptionist'),
    patientController.deletePatient
);

export default router;
