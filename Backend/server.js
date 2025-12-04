// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import DB connection
import db from './config/db.js';

// Import Routes
import authRoutes from './routes/authRoutes.js';
import patientRoutes from './routes/patientRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import prescriptionRoutes from './routes/prescriptionRoutes.js';
import billRoutes from './routes/billRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import employeeRoutes from './routes/employeeRoutes.js';
import roomRoutes from './routes/roomRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Root Route
app.get('/', (req, res) => {
    res.send('EasyCare Hospital System API is running.');
});

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/patients', patientRoutes);
app.use('/api/v1/appointments', appointmentRoutes);
app.use('/api/v1/prescriptions', prescriptionRoutes);
app.use('/api/v1/bills', billRoutes);
app.use('/api/v1/reports', reportRoutes);
app.use('/api/v1/employees', employeeRoutes);
app.use('/api/v1/rooms', roomRoutes);

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
