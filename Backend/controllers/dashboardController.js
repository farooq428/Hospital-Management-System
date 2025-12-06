import db from '../config/db.js';

// ============================
// ✅ ADMIN DASHBOARD STATS
// ============================
export const getAdminDashboardStats = async (req, res) => {
  try {
    const [employees] = await db.query(`
      SELECT COUNT(*) AS totalEmployees 
      FROM Employee E 
      JOIN Role R ON E.Role_ID = R.Role_ID 
      WHERE R.Role_Name != 'Patient'
    `);

    const [roles] = await db.query(`
      SELECT COUNT(*) AS totalRoles 
      FROM Role 
      WHERE Role_Name != 'Patient'
    `);

    const [roomsTotal] = await db.query(`
      SELECT COUNT(*) AS totalRooms FROM Room
    `);

    const [roomsOccupied] = await db.query(`
      SELECT COUNT(*) AS occupiedRooms 
      FROM Room 
      WHERE Status = 'Occupied'
    `);

    const roomOccupancy =
      roomsTotal[0].totalRooms === 0
        ? '0%'
        : Math.round(
            (roomsOccupied[0].occupiedRooms / roomsTotal[0].totalRooms) * 100
          ) + '%';

    res.status(200).json({
      totalEmployees: employees[0].totalEmployees,
      totalRoles: roles[0].totalRoles,
      roomOccupancy,
    });
  } catch (error) {
    console.error('Error fetching admin dashboard stats:', error);
    res.status(500).json({ message: 'Server error fetching dashboard stats' });
  }
};

// ============================
// ✅ RECEPTIONIST DASHBOARD STATS
// ============================
// controllers/dashboardController.js


export const getReceptionistDashboardStats = async (req, res) => {
  try {
    // Total appointments today (considering only 'Scheduled' or 'Confirmed')
    const [appointmentsToday] = await db.query(
      `SELECT COUNT(*) AS totalAppointments
       FROM Appointment
       WHERE DATE(Date) = CURDATE()
       AND Status IN ('Scheduled','Confirmed')`
    );

    // Patients currently checked in (Room_Assignment where discharge date is null)
    const [patientsCheckedIn] = await db.query(
      `SELECT COUNT(*) AS total
       FROM Room_Assignment
       WHERE Discharge_Date IS NULL`
    );

    // Total rooms and currently occupied rooms (Status = 'Occupied')
    const [roomsTotal] = await db.query(
      `SELECT COUNT(*) AS totalRooms FROM Room`
    );

    const [roomsOccupied] = await db.query(
      `SELECT COUNT(*) AS occupiedRooms FROM Room WHERE Status = 'Occupied'`
    );

    const availableRooms = roomsTotal[0].totalRooms - roomsOccupied[0].occupiedRooms;

    // Pending bills
    const [pendingBills] = await db.query(
      `SELECT COUNT(*) AS totalPending FROM Bill WHERE Status = 'Pending'`
    );

    res.status(200).json({
      totalAppointmentsToday: appointmentsToday[0].totalAppointments,
      patientsCheckedIn: patientsCheckedIn[0].total,
      availableRooms,
      pendingBills: pendingBills[0].totalPending,
      totalRooms: roomsTotal[0].totalRooms,
      occupiedRooms: roomsOccupied[0].occupiedRooms,
    });
  } catch (error) {
    console.error('Error fetching receptionist dashboard stats:', error);
    res.status(500).json({ message: 'Server error fetching receptionist dashboard stats' });
  }
};


// ============================
// ✅ DOCTOR DASHBOARD STATS
// ============================
export const getDoctorDashboardStats = async (req, res) => {
  try {
    const doctorId = req.user?.id || 1;

    const [todayAppointments] = await db.query(
      `SELECT A.Time, P.Name AS Patient_Name, A.Reason
       FROM Appointment A
       JOIN Patient P ON A.Patient_ID = P.Patient_ID
       WHERE A.Employee_ID = ?
       AND DATE(A.Date) = CURDATE()`,
      [doctorId]
    );

    const [totalPatients] = await db.query(
      `SELECT COUNT(DISTINCT Patient_ID) AS total
       FROM Appointment
       WHERE Employee_ID = ?`,
      [doctorId]
    );

    const [pendingReports] = await db.query(
      `SELECT COUNT(*) AS total
       FROM Test_Report
       WHERE Patient_ID IN (
         SELECT DISTINCT Patient_ID
         FROM Appointment
         WHERE Employee_ID = ?
       )`,
      [doctorId]
    );

    res.status(200).json({
      todayAppointments,
      totalPatients: totalPatients[0].total,
      pendingReports: pendingReports[0].total,
    });
  } catch (error) {
    console.error('Error fetching doctor dashboard stats:', error);
    res.status(500).json({ message: 'Server error fetching doctor stats' });
  }
};

// ============================
// ✅ SYSTEM LOGS (MOCK)
// ============================
export const getSystemLogs = async (req, res) => {
  try {
    const mockLogs = [
      { id: 1, action: 'Created employee John', user: 'Admin', date: new Date() },
      { id: 2, action: 'Deleted appointment #3', user: 'Receptionist', date: new Date() },
      { id: 3, action: 'Updated role Doctor', user: 'Admin', date: new Date() },
    ];

    res.status(200).json(mockLogs);
  } catch (error) {
    console.error('Error fetching logs:', error);
    res.status(500).json({ message: 'Server error fetching logs' });
  }
};
