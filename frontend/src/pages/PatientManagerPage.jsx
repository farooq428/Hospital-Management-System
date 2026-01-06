import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "../components/DataTable";
import { useAuth } from "../context/AuthContext";
import API from "../api/config";

// --- Icons for better UI ---
const PlusIcon = () => (
  <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
);
const SearchIcon = () => (
    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
);
// --- End Icons ---

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
        // Reverse is typically for showing most recent first, which is often good practice.
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
      // API call to assign patient to room
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

      // Update patient state locally
      setPatients((prev) =>
        prev.map((p) =>
          p.Patient_ID === selectedPatient.Patient_ID
            ? { ...p, Room: assignedRoom.Room_Number }
            : p
        )
      );

      // Optionally update the room status locally (to occupied)
      setRooms((prev) =>
        prev.map((r) =>
          r.Room_ID === Number(selectedRoom)
            ? { ...r, Status: "Occupied" }
            : r
        )
      );

      // Close modal
      setAssignRoomModal(false);
      alert(`Patient ${selectedPatient.Name} assigned to room ${assignedRoom.Room_Number}`);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to assign room.");
    }
  };

  const handleGenerateInvoice = async () => {
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      alert("Enter a valid amount.");
      return;
    }

     const newBill = {
    patientId: selectedPatient.Patient_ID, 
    amount: parseFloat(amount),           
  };

    try {
      await API.post("/bills", newBill);
      setInvoiceModal(false);
      alert("Invoice generated and printed successfully!");
      
    } catch (err) {
      console.error("Failed to generate invoice:", err);
      alert("Failed to generate invoice.");
    }
  };

  const handleRemovePatient = async (patient) => {
    if (!window.confirm(`Are you sure you want to delete ${patient.Name} (ID: ${patient.Patient_ID})?`))
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
    const lowerSearch = search.toLowerCase();
    return formattedPatients.filter(
      (p) =>
        p.Name?.toLowerCase().includes(lowerSearch) ||
        p.Phone?.toLowerCase().includes(lowerSearch) ||
        p.Gender?.toLowerCase().includes(lowerSearch) ||
        String(p.Patient_ID).includes(search)
    );
  }, [search, formattedPatients]);

  // --- Action Definition ---
  const patientActions = [
    { label: "View Profile", handler: handleViewProfile },
    // Actions for Receptionist role
    { label: "Generate Invoice", handler: openInvoiceModal, role: "Receptionist" },
    { label: "Assign Room", handler: openAssignRoomModal, role: "Receptionist" },
    { label: "Delete", handler: handleRemovePatient, role: "Receptionist" },
  ];

  // Filter actions based on user role before passing to DataTable
  const filteredActions = patientActions.filter(
    (a) => !a.role || user?.role === a.role
  );
  // -------------------------

  return (
    <div className="w-full p-4 sm:p-6 lg:p-8 space-y-8 min-h-screen">
      
      {/* 🏥 Header & Actions Container */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-blue-700">
              Patient Management Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Central hub for patient records, admissions, and billing.
            </p>
          </div>
        </div>
        
        {/* Search Bar and Primary Action Button */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mt-6">
            
            {/* Search Input */}
            <div className="relative w-full sm:w-80">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon />
                </div>
                <input
                    type="text"
                    placeholder="Search by Name, ID, or Phone..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors shadow-sm text-sm"
                />
            </div>

            {/* Add Patient Button (Top Right) */}
            {isReceptionist && (
                <button
                    onClick={() => navigate("/patients/new")}
                    className="flex items-center justify-center px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all shadow-md transform hover:-translate-y-0.5"
                >
                    Register New Patient
                </button>
            )}
        </div>
      </div>

      {/* 📋 Patients Table */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        
        {loading ? (
          <div className="flex justify-center items-center min-h-[400px] text-lg text-gray-500">
            <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            Fetching patient records...
          </div>
        ) : (
          <DataTable
            data={searchedPatients}
            columns={[
              { header: "ID", accessor: "Patient_ID", className: "font-semibold text-gray-700" },
              { header: "Name", accessor: "Name" },
              { header: "DOB", accessor: "formattedDOB" },
              { header: "Gender", accessor: "Gender" },
              { header: "Phone", accessor: "Phone" },
              { 
                header: "Room", 
                accessor: "Room", 
                render: (data) => (
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${data.Room ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {data.Room || 'Unassigned'}
                    </span>
                )
              },
              // IMPORTANT: Do NOT define an "Actions" column here.
              // DataTable handles the actions column automatically via the `actions` prop.
            ]}
            actions={filteredActions} // Pass the actions here.
          />
        )}
      </div>
      
      {/*  Invoice Modal (no change) */}
      {invoiceModal && selectedPatient && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center p-4 z-50 transition-opacity duration-300">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md animate-in zoom-in duration-300">
            <h2 className="text-2xl font-bold text-blue-700 mb-4 border-b pb-2">Generate Invoice</h2>
            <p className="text-gray-700 mb-4">
              Patient: <b className="text-blue-600">{selectedPatient.Name}</b> (ID: {selectedPatient.Patient_ID})
            </p>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">Invoice Amount (PKR)</label>
            <input
              id="amount"
              type="number"
              placeholder="e.g. 500.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full border border-gray-300 px-4 py-3 rounded-xl mb-6 focus:ring-blue-500 focus:border-blue-500 transition"
              min="0.01"
              step="0.01"
            />
            {/* ACTION BUTTONS AT BOTTOM OF MODAL */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100"> 
              <button
                onClick={() => setInvoiceModal(false)}
                className="px-6 py-2 bg-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerateInvoice}
                className="px-6 py-2 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition-colors shadow-md"
              >
                Generate & Print
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🛌 Assign Room Modal (no change) */}
      {assignRoomModal && selectedPatient && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center p-4 z-50 transition-opacity duration-300">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md animate-in zoom-in duration-300">
            <h2 className="text-2xl font-bold text-blue-700 mb-4 border-b pb-2">Assign Room</h2>
            <p className="text-gray-700 mb-4">
              Patient: <b className="text-blue-600">{selectedPatient.Name}</b>
            </p>
            <label htmlFor="room-select" className="block text-sm font-medium text-gray-700 mb-1">Select Available Room</label>
            <select
              id="room-select"
              value={selectedRoom}
              onChange={(e) => setSelectedRoom(e.target.value)}
              className="w-full border border-gray-300 px-4 py-3 rounded-xl mb-6 focus:ring-blue-500 focus:border-blue-500 transition bg-white"
            >
              <option value="">Select Room</option>
              {rooms
                .map((room) => (
                  <option key={room.Room_ID} value={room.Room_ID}>
                    {room.Room_Number} ({room.Room_Type}) - ID:{room.Room_ID}
                  </option>
                ))}
            </select>
            {/* ACTION BUTTONS AT BOTTOM OF MODAL */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                onClick={() => setAssignRoomModal(false)}
                className="px-6 py-2 bg-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAssignRoom}
                className="px-6 py-2 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition-colors shadow-md"
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