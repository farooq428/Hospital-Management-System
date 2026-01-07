import db from "../config/db.js";

// Add a new test report (Doctor only)
export const addTestReport = async (req, res) => {
  try {
    const { Patient_ID, Type, Result, Date } = req.body;
    if (!Patient_ID || !Type || !Result || !Date) {
      return res.status(400).json({ message: "All fields are required." });
    }
    await db.query(
      "INSERT INTO Test_Report (Patient_ID, Type, Result, Date) VALUES (?, ?, ?, ?)",
      [Patient_ID, Type, Result, Date]
    );
    res.status(201).json({ message: "Test report added successfully." });
  } catch (error) {
    console.error("Error adding test report:", error);
    res.status(500).json({ message: "Server error adding test report." });
  }
};

// (Optional) Get all test reports for a patient
export const getPatientTestReports = async (req, res) => {
  try {
    const { patientId } = req.params;
    const [reports] = await db.query(
      "SELECT * FROM Test_Report WHERE Patient_ID = ? ORDER BY Date DESC",
      [patientId]
    );
    res.status(200).json(reports);
  } catch (error) {
    console.error("Error fetching test reports:", error);
    res.status(500).json({ message: "Server error fetching test reports." });
  }
};