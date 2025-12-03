// routes/roomRoutes.js
import express from 'express';
import { protect, restrictTo } from '../middleware/authMiddleware.js';
import * as roomController from '../controllers/roomController.js';

const router = express.Router();

// 1. Get All Rooms and Current Status (Used by Room Manager Page)
router.get(
    '/',
    protect,
    restrictTo('Receptionist', 'Admin'),
    roomController.getAllRooms
);

// 2. Assign a Patient to a Room (Admission)
router.post(
    '/assign',
    protect,
    restrictTo('Receptionist'),
    roomController.createRoomAssignment
);

// 3. Discharge a Patient from a Room (Completes the assignment)
router.put(
    '/discharge/:roomId',
    protect,
    restrictTo('Receptionist'),
    roomController.dischargePatient
);

// 4. Update a Room's permanent status (e.g., set to Maintenance)
router.put(
    '/:roomId/status',
    protect,
    restrictTo('Admin'),
    roomController.updateRoomStatus
);

export default router;  