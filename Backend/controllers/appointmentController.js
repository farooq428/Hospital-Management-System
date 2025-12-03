// controllers/appointmentController.js
import db from '../config/db.js';

// @route POST /api/v1/appointments
// Used by Receptionist to book an appointment
export const createAppointment = async (req, res) => {
    const { patientId, doctorId, date, time, reason } = req.body;
    
    // Simple validation: Ensure all required fields are present
    if (!patientId || !doctorId || !date || !time) {
        return res.status(400).json({ message: 'Missing required appointment fields.' });
    }

    try {
        // Optional: Check for time slot availability for the doctor
        const [existing] = await db.query(
            `SELECT * FROM Appointment WHERE Employee_ID = ? AND Date = ? AND Time = ?`,
            [doctorId, date, time]
        );

        if (existing.length > 0) {
            return res.status(409).json({ message: 'Appointment slot already booked for this doctor.' });
        }

        const [result] = await db.query(
            `INSERT INTO Appointment (Patient_ID, Employee_ID, Date, Time, Reason) VALUES (?, ?, ?, ?, ?)`,
            [patientId, doctorId, date, time, reason]
        );
        
        res.status(201).json({ 
            message: 'Appointment booked successfully.', 
            appointmentId: result.insertId 
        });
    } catch (error) {
        console.error('Error creating appointment:', error);
        res.status(500).json({ message: 'Server error during appointment creation.' });
    }
};

// @route GET /api/v1/appointments
// Used by Receptionist for the main manager table
export const getAllAppointments = async (req, res) => {
    try {
        const [appointments] = await db.query(
            `SELECT 
                A.Appointment_ID, A.Date, A.Time, A.Reason,
                P.Name AS Patient_Name, P.Patient_ID,
                E.Name AS Doctor_Name, E.Employee_ID
            FROM Appointment A
            JOIN Patient P ON A.Patient_ID = P.Patient_ID
            JOIN Employee E ON A.Employee_ID = E.Employee_ID
            ORDER BY A.Date DESC, A.Time ASC`
        );
        res.status(200).json(appointments);
    } catch (error) {
        console.error('Error fetching all appointments:', error);
        res.status(500).json({ message: 'Server error while fetching appointments.' });
    }
};


// @route GET /api/v1/appointments/doctor/:id
// Used by Doctor Dashboard (id is the doctor's Employee_ID)
export const getAppointmentsByDoctor = async (req, res) => {
    const { id } = req.params;
    const { date } = req.query; // Allow filtering by date (optional)
    
    // Ensure the logged-in user (req.user.id) matches the requested doctor ID unless they are an Admin
    if (req.user.role === 'Doctor' && req.user.id != id) {
        return res.status(403).json({ message: 'Forbidden: You can only view your own appointments.' });
    }

    let query = `
        SELECT 
            A.Appointment_ID, A.Date, A.Time, A.Reason,
            P.Name AS Patient_Name, P.Patient_ID
        FROM Appointment A
        JOIN Patient P ON A.Patient_ID = P.Patient_ID
        WHERE A.Employee_ID = ?`;
    
    const params = [id];

    if (date) {
        query += ` AND A.Date = ?`;
        params.push(date);
    }
    
    query += ` ORDER BY A.Time ASC`;

    try {
        const [appointments] = await db.query(query, params);
        res.status(200).json(appointments);
    } catch (error) {
        console.error('Error fetching doctor appointments:', error);
        res.status(500).json({ message: 'Server error while fetching doctor appointments.' });
    }
};

// @route PUT /api/v1/appointments/:id
// Used by Receptionist to update appointment details or cancel
export const updateAppointment = async (req, res) => {
    const { id } = req.params;
    const { doctorId, date, time, reason } = req.body;
    
    // Build the query dynamically
    const setClauses = [];
    const params = [];
    
    if (doctorId) { setClauses.push('Employee_ID = ?'); params.push(doctorId); }
    if (date) { setClauses.push('Date = ?'); params.push(date); }
    if (time) { setClauses.push('Time = ?'); params.push(time); }
    if (reason) { setClauses.push('Reason = ?'); params.push(reason); }
    
    if (setClauses.length === 0) {
        return res.status(400).json({ message: 'No fields provided for update.' });
    }

    params.push(id); // Add Appointment_ID for the WHERE clause

    try {
        const [result] = await db.query(
            `UPDATE Appointment SET ${setClauses.join(', ')} WHERE Appointment_ID = ?`,
            params
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Appointment not found or no changes made.' });
        }

        res.status(200).json({ message: 'Appointment updated successfully.' });
    } catch (error) {
        console.error('Error updating appointment:', error);
        res.status(500).json({ message: 'Server error during appointment update.' });
    }
};