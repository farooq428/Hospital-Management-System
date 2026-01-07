import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "../components/DataTable";
import { useAuth } from "../context/AuthContext";
import API from "../api/config";
import BillForm from "../components/forms/BillForm";

// --- Icons ---
const PlusIcon = () => (
  <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
  </svg>
);

const SearchIcon = () => (
  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const PatientManagerPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [invoiceModal, setInvoiceModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [search, setSearch] = useState("");

  const isReceptionist =
    user?.role === "Receptionist" || user?.role === "Admin";

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const dateObj = new Date(dateString);
    return isNaN(dateObj.getTime())
      ? "N/A"
      : dateObj.toLocaleDateString("en-CA");
  };

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

  const openInvoiceModal = (patient) => {
    setSelectedPatient(patient);
    setInvoiceModal(true);
  };

  const handleRemovePatient = async (patient) => {
    if (
      !window.confirm(
        `PERMANENT DELETE: Are you sure you want to remove ${patient.Name}?`
      )
    )
      return;

    try {
      await API.delete(`/patients/${patient.Patient_ID}`);
      setPatients((prev) =>
        prev.filter((p) => p.Patient_ID !== patient.Patient_ID)
      );
    } catch (err) {
      alert("Error: Patient record linked to active billing.");
    }
  };

  const searchedPatients = useMemo(() => {
    const lowerSearch = search.toLowerCase();
    return patients
      .map((p) => ({ ...p, formattedDOB: formatDate(p.DOB) }))
      .filter(
        (p) =>
          p.Name?.toLowerCase().includes(lowerSearch) ||
          p.Phone?.toLowerCase().includes(lowerSearch) ||
          String(p.Patient_ID).includes(search)
      );
  }, [search, patients]);

  const patientActions = [
    {
      label: "View Profile",
      handler: (p) => navigate(`/patients/${p.Patient_ID}`),
      className: "text-blue-600 hover:text-blue-800 font-medium",
    },
    {
      label: "Generate Bill",
      handler: openInvoiceModal,
      role: "Receptionist",
      className: "text-green-600 hover:text-green-800 font-medium",
    },
    {
      label: "Delete",
      handler: handleRemovePatient,
      role: "Receptionist",
      className: "text-red-500 hover:text-red-700",
    },
  ];

  const filteredActions = patientActions.filter(
    (a) => !a.role || user?.role === a.role || user?.role === "Admin"
  );

  return (
    <div className="w-full p-6 lg:p-10 space-y-8 bg-gray-50 min-h-screen">
      {/* --- Header --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-gray-900">
            Patient <span className="text-blue-600">Records</span>
          </h1>
          <p className="text-gray-500">Hospital Information System</p>
        </div>

        {isReceptionist && (
          <button
            onClick={() => navigate("/patients/new")}
            className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700"
          >
            <PlusIcon /> Register Patient
          </button>
        )}
      </div>

      {/* --- Search --- */}
      <div className="bg-white p-4 rounded-xl shadow-sm flex items-center gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center">
            <SearchIcon />
          </div>
          <input
            type="text"
            placeholder="Search by name, ID, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl"
          />
        </div>
      </div>

      {/* --- Table --- */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            Loading...
          </div>
        ) : (
          <DataTable
            data={searchedPatients}
            columns={[
              { header: "ID", accessor: "Patient_ID" },
              { header: "Name", accessor: "Name" },
              { header: "DOB", accessor: "formattedDOB" },
              { header: "Gender", accessor: "Gender" },
              { header: "Phone", accessor: "Phone" },
            ]}
            actions={filteredActions}
          />
        )}
      </div>

      {/* --- Bill Modal --- */}
      {invoiceModal && selectedPatient && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl max-w-lg w-full">
            <BillForm
              selectedPatient={selectedPatient}
              onClose={() => setInvoiceModal(false)}
              onSubmit={() => setInvoiceModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientManagerPage;
