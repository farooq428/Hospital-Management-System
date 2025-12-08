import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "../components/DataTable";
import { useAuth } from "../context/AuthContext";
import API from "../api/config";

const PatientManagerPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  const [invoiceModal, setInvoiceModal] = useState(false);
  const [assignRoomModal, setAssignRoomModal] = useState(false);

  const [selectedPatient, setSelectedPatient] = useState(null);
  const [amount, setAmount] = useState("");
  const [search, setSearch] = useState("");

  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState("");

  const isReceptionist = user?.role === "Receptionist";

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const dateObj = new Date(dateString);
    return isNaN(dateObj.getTime())
      ? "N/A"
      : dateObj.toLocaleDateString("en-CA");
  };

  // Fetch patients
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await API.get("/patients");
        setPatients((res.data || []).slice().reverse());
      } catch (err) {
        console.error("Failed to fetch patients:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  // Fetch available rooms
  const fetchRooms = async () => {
    try {
      const res = await API.get("/rooms");
      // Only show rooms that are available
      const availableRooms = (res.data || []).filter(
        (r) => r.Status === "Available"
      );
      setRooms(availableRooms);
    } catch (err) {
      console.error("Failed to fetch rooms:", err);
    }
  };

  const openInvoiceModal = (patient) => {
    setSelectedPatient(patient);
    setAmount("");
    setInvoiceModal(true);
  };

  const openAssignRoomModal = (patient) => {
    setSelectedPatient(patient);
    setSelectedRoom(patient.Room || "");
    fetchRooms();
    setAssignRoomModal(true);
  };

  const handleAssignRoom = async () => {
    if (!selectedRoom) {
      alert("Please select a room.");
      return;
    }

    try {
      // Assign patient to room
      await API.put(`/rooms/assign/${selectedRoom}`, {
        Patient_ID: selectedPatient.Patient_ID,
      });

      // Update patient state locally
      setPatients((prev) =>
        prev.map((p) =>
          p.Patient_ID === selectedPatient.Patient_ID
            ? { ...p, Room: selectedRoom }
            : p
        )
      );

      // Close modal
      setAssignRoomModal(false);
      alert(`Patient ${selectedPatient.Name} assigned to room ${selectedRoom}`);
    } catch (err) {
      console.error(err);
      alert("Failed to assign room.");
    }
  };

  const handleGenerateInvoice = async () => {
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      alert("Enter a valid amount.");
      return;
    }

    const newBill = {
      Patient_ID: selectedPatient.Patient_ID,
      Patient_Name: selectedPatient.Name,
      Date: new Date().toISOString(),
      Amount: parseFloat(amount).toFixed(2),
      Status: "Pending",
    };

    try {
      const res = await API.post("/bills", newBill);
      const bill = res.data;
      setInvoiceModal(false);

      const printContent = `
        <html>
          <head>
            <title>Bill ID: ${bill.Bill_ID}</title>
            <style>
              body { font-family: Arial; padding: 20px; }
              h2 { color: #16a34a; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              td, th { border: 1px solid #ccc; padding: 8px; }
            </style>
          </head>
          <body>
            <h2>EasyCare HMS - Bill</h2>
            <p><b>Patient:</b> ${bill.Patient_Name}</p>
            <p><b>Date:</b> ${formatDate(bill.Date)}</p>
            <table>
              <tr>
                <th>Description</th>
                <th>Amount</th>
              </tr>
              <tr>
                <td>Services / Consultation</td>
                <td>$${bill.Amount}</td>
              </tr>
            </table>
            <p><b>Status:</b> ${bill.Status}</p>
          </body>
        </html>
      `;

      const printWindow = window.open("", "", "width=800,height=600");
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
      printWindow.close();
    } catch (err) {
      console.error("Failed to generate invoice:", err);
      alert("Failed to generate invoice.");
    }
  };

  const handleRemovePatient = async (patient) => {
    if (!window.confirm(`Are you sure you want to delete ${patient.Name}?`))
      return;
    try {
      await API.delete(`/patients/${patient.Patient_ID}`);
      setPatients((prev) =>
        prev.filter((p) => p.Patient_ID !== patient.Patient_ID)
      );
      alert(`${patient.Name} removed successfully.`);
    } catch (err) {
      alert("Failed to remove patient.");
    }
  };

  const handleViewProfile = (patient) =>
    navigate(`/patients/${patient.Patient_ID}`);

  const formattedPatients = useMemo(
    () => patients.map((p) => ({ ...p, formattedDOB: formatDate(p.DOB) })),
    [patients]
  );

  const searchedPatients = useMemo(() => {
    if (!search) return formattedPatients;
    return formattedPatients.filter(
      (p) =>
        p.Name?.toLowerCase().includes(search.toLowerCase()) ||
        p.Phone?.toLowerCase().includes(search.toLowerCase()) ||
        p.Gender?.toLowerCase().includes(search.toLowerCase()) ||
        String(p.Patient_ID).includes(search)
    );
  }, [search, formattedPatients]);

  const patientActions = [
    { label: "View Profile", handler: handleViewProfile },
    { label: "Generate Invoice", handler: openInvoiceModal },
    { label: "Assign Room", handler: openAssignRoomModal },
    { label: "Delete", handler: handleRemovePatient },
  ];

  return (
    <div className="w-full p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-600">
            Patient Management
          </h1>
          <p className="text-gray-500 text-sm">
            View, manage patients, and generate invoices
          </p>
        </div>
      </div>

      {/* Add Patient Button */}
      {isReceptionist && (
        <button
          onClick={() => navigate("/patients/new")}
          className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-800 shadow"
        >
          Add New Patient
        </button>
      )}

      {/* Search */}
      <div className="flex justify-left">
        <input
          type="text"
          placeholder="Search patient..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-80 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <h1 className="text-2xl sm:text-3xl font-bold text-blue-600 text-center">
        Registered Patients
      </h1>

      {/* Patients Table */}
      <div className="bg-white rounded-2xl shadow-lg border overflow-x-auto">
        {loading ? (
          <div className="flex justify-center items-center min-h-[60vh]">
            Loading patients...
          </div>
        ) : (
          <DataTable
            data={searchedPatients}
            columns={[
              { header: "Patient ID", accessor: "Patient_ID" },
              { header: "Name", accessor: "Name" },
              { header: "DOB", accessor: "formattedDOB" },
              { header: "Gender", accessor: "Gender" },
              { header: "Phone", accessor: "Phone" },
              { header: "Room", accessor: "Room" },
            ]}
            actions={patientActions}
          />
        )}
      </div>

      {/* Invoice Modal */}
      {invoiceModal && selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
            <h2 className="text-xl font-semibold mb-3">Generate Invoice</h2>
            <p className="mb-2">
              Patient: <b>{selectedPatient.Name}</b>
            </p>
            <input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full border px-3 py-2 rounded mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setInvoiceModal(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerateInvoice}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Generate & Print
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Room Modal */}
      {assignRoomModal && selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
            <h2 className="text-xl font-semibold mb-3">Assign Room</h2>
            <p className="mb-2">
              Patient: <b>{selectedPatient.Name}</b>
            </p>
            <select
              value={selectedRoom}
              onChange={(e) => setSelectedRoom(e.target.value)}
              className="w-full border px-3 py-2 rounded mb-4"
            >
              <option value="">Select Room</option>
              {rooms
                .filter((r) => r.Status === "Available") // show only available rooms
                .map((room) => (
                  <option key={room.Room_ID} value={room.Room_ID}>
                    ID:{room.Room_ID} - {room.Room_Number} ({room.Room_Type})
                  </option>
                ))}
            </select>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setAssignRoomModal(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (!selectedRoom) {
                    alert("Please select a room.");
                    return;
                  }

                  try {
                    await API.post("/rooms/assign", {
                      patientId: selectedPatient.Patient_ID,
                      roomId: Number(selectedRoom),
                      admissionDate: new Date()
                        .toISOString()
                        .slice(0, 19)
                        .replace("T", " "),
                    });

                    const assignedRoom = rooms.find(
                      (r) => r.Room_ID === Number(selectedRoom)
                    );

                    setPatients((prev) =>
                      prev.map((p) =>
                        p.Patient_ID === selectedPatient.Patient_ID
                          ? { ...p, Room: assignedRoom.Room_Number }
                          : p
                      )
                    );

                    // Optionally update the room list locally
                    setRooms((prev) =>
                      prev.map((r) =>
                        r.Room_ID === Number(selectedRoom)
                          ? { ...r, Status: "Occupied" }
                          : r
                      )
                    );

                    setAssignRoomModal(false);
                    alert(
                      `Patient ${selectedPatient.Name} assigned to room ${assignedRoom.Room_Number}`
                    );
                  } catch (err) {
                    console.error("Failed to assign room:", err);
                    alert(
                      err.response?.data?.message || "Failed to assign room."
                    );
                  }
                }}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Assign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientManagerPage;
