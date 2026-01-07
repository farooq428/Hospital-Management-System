import express from "express";
import { protect, restrictTo } from "../middleware/authMiddleware.js";
import { addTestReport, getPatientTestReports } from "../controllers/testReportController.js";

const router = express.Router();

// Doctor adds a test report
router.post("/", protect, restrictTo("Doctor"), addTestReport);

// (Optional) Get all test reports for a patient
router.get("/:patientId", protect, restrictTo("Doctor"), getPatientTestReports);

export default router;