// backend/controllers/dashboardController.js
import db from '../config/db.js';

// Get Admin Dashboard Stats
export const getAdminDashboardStats = async (req, res) => {
  try {
    // Total employees (excluding patients)
    const [employees] = await db.query(`SELECT COUNT(*) AS totalEmployees FROM Employee E JOIN Role R ON E.Role_ID = R.Role_ID WHERE R.Role_Name != 'Patient'`);

    // Total roles (excluding patients)
    const [roles] = await db.query(`SELECT COUNT(*) AS totalRoles FROM Role WHERE Role_Name != 'Patient'`);

    // Room occupancy
    const [roomsTotal] = await db.query(`SELECT COUNT(*) AS totalRooms FROM Room`);
    const [roomsOccupied] = await db.query(`SELECT COUNT(*) AS occupiedRooms FROM Room WHERE Status = 'Occupied'`);

    const roomOccupancy = roomsTotal[0].totalRooms === 0
      ? '0%'
      : Math.round((roomsOccupied[0].occupiedRooms / roomsTotal[0].totalRooms) * 100) + '%';

    res.status(200).json({
      totalEmployees: employees[0].totalEmployees,
      totalRoles: roles[0].totalRoles,
      roomOccupancy
    });
  } catch (error) {
    console.error('Error fetching admin dashboard stats:', error);
    res.status(500).json({ message: 'Server error fetching dashboard stats' });
  }
};

// Get System Logs (mock for now)
export const getSystemLogs = async (req, res) => {
  try {
    // You can replace this with real log table queries later
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
