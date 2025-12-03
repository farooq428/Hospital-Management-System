// controllers/roomController.js
import db from '../config/db.js';

// @route GET /api/v1/rooms
// Fetches list of all rooms with current occupancy status
export const getAllRooms = async (req, res) => {
    try {
        // Query to get all rooms and link to the LATEST active assignment (Discharge_Date IS NULL)
        const [rooms] = await db.query(
            `SELECT 
                R.Room_ID, R.Room_Type, R.Status,
                A.Patient_ID, P.Name AS Patient_Name, A.Admission_Date
            FROM Room R
            LEFT JOIN Room_Assignment A ON R.Room_ID = A.Room_ID AND A.Discharge_Date IS NULL
            LEFT JOIN Patient P ON A.Patient_ID = P.Patient_ID
            ORDER BY R.Room_ID ASC`
        );
        
        res.status(200).json(rooms);
    } catch (error) {
        console.error('Error fetching rooms:', error);
        res.status(500).json({ message: 'Server error while fetching room status.' });
    }
};

// @route POST /api/v1/rooms/assign
// Assigns a patient to a room (Admission)
export const createRoomAssignment = async (req, res) => {
    const { patientId, roomId, admissionDate } = req.body;
    
    if (!patientId || !roomId || !admissionDate) {
        return res.status(400).json({ message: 'Missing required assignment fields.' });
    }

    try {
        // 1. Check if the room is truly 'Available' and not occupied or in maintenance
        const [roomCheck] = await db.query(`SELECT Status FROM Room WHERE Room_ID = ?`, [roomId]);
        if (roomCheck.length === 0 || roomCheck[0].Status !== 'Available') {
            return res.status(409).json({ message: `Room ${roomId} is not available for assignment.` });
        }

        // 2. Create the Room_Assignment record (Discharge_Date is NULL)
        const [assignmentResult] = await db.query(
            `INSERT INTO Room_Assignment (Patient_ID, Room_ID, Admission_Date, Discharge_Date) 
             VALUES (?, ?, ?, NULL)`,
            [patientId, roomId, admissionDate]
        );
        
        // 3. Update the Room status to 'Occupied'
        await db.query(`UPDATE Room SET Status = 'Occupied' WHERE Room_ID = ?`, [roomId]);
        
        res.status(201).json({ 
            message: `Patient ${patientId} admitted to Room ${roomId} successfully.`, 
            assignmentId: assignmentResult.insertId 
        });
    } catch (error) {
        console.error('Error creating room assignment:', error);
        res.status(500).json({ message: 'Server error during patient admission.' });
    }
};

// @route PUT /api/v1/rooms/discharge/:roomId
// Completes a room assignment (Discharge)
export const dischargePatient = async (req, res) => {
    const { roomId } = req.params;
    const dischargeDate = new Date().toISOString().slice(0, 19).replace('T', ' '); // Current datetime

    try {
        // 1. Find the active assignment for this room
        const [assignment] = await db.query(
            `SELECT Assignment_ID FROM Room_Assignment WHERE Room_ID = ? AND Discharge_Date IS NULL`,
            [roomId]
        );

        if (assignment.length === 0) {
            return res.status(404).json({ message: `Room ${roomId} has no active patient assignment.` });
        }
        const assignmentId = assignment[0].Assignment_ID;

        // 2. Update the Room_Assignment record with the Discharge_Date
        await db.query(
            `UPDATE Room_Assignment SET Discharge_Date = ? WHERE Assignment_ID = ?`,
            [dischargeDate, assignmentId]
        );
        
        // 3. Update the Room status back to 'Available'
        await db.query(`UPDATE Room SET Status = 'Available' WHERE Room_ID = ?`, [roomId]);

        res.status(200).json({ 
            message: `Patient discharged from Room ${roomId}. Room is now available.`, 
            assignmentId 
        });
    } catch (error) {
        console.error('Error discharging patient:', error);
        res.status(500).json({ message: 'Server error during patient discharge.' });
    }
};

// @route PUT /api/v1/rooms/:roomId/status
// Updates the permanent status of a room (e.g., Maintenance)
export const updateRoomStatus = async (req, res) => {
    const { roomId } = req.params;
    const { status } = req.body; 

    if (!status || !['Available', 'Occupied', 'Maintenance'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status provided. Must be Available, Occupied, or Maintenance.' });
    }

    try {
        const [result] = await db.query(
            `UPDATE Room SET Status = ? WHERE Room_ID = ?`,
            [status, roomId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Room not found.' });
        }

        res.status(200).json({ message: `Room ${roomId} status updated to ${status}.` });
    } catch (error) {
        console.error('Error updating room status:', error);
        res.status(500).json({ message: 'Server error during room status update.' });
    }
};