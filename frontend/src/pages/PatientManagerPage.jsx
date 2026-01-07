import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "../components/DataTable";
import { useAuth } from "../context/AuthContext";
import API from "../api/config";
import BillForm from "../components/forms/BillForm";

// --- Minimal Icons ---
const PlusIcon = () => (
  <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const SearchIcon = () => (
  <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

// --- Refined Quick Book Modal ---
const QuickBookModal = ({ patient, onClose }) => {
  const [doctors, setDoctors] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    doctorId: "",
    date: new Date().toISOString().split("T")[0],
    time: "",
    reason: "Follow-up Visit"
  });

  useEffect(() => {
    API.get("/employees?role=Doctor")
      .then(res => setDoctors(res.data || []))
      .catch(err => console.error(err));
  }, []);

  const handleQuickBook = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await API.post("/appointments", { patientId: patient.Patient_ID, ...formData });
      alert("Appointment confirmed! ✅");
      onClose();
    } catch (err) {
      alert("Error: Doctor may be unavailable.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Quick Booking</h2>
            <p className="text-xs text-slate-500">Patient: {patient.Name}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors text-2xl">&times;</button>
        </div>

        <form onSubmit={handleQuickBook} className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Assign Doctor</label>
            <select 
              required
              className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={formData.doctorId}
              onChange={(e) => setFormData({...formData, doctorId: e.target.value})}
            >
              <option value="">Select Practitioner...</option>
              {doctors.map(d => <option key={d.Employee_ID} value={d.Employee_ID}>{d.Name}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Date</label>
              <input 
                type="date" required className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-sm"
                min={new Date().toISOString().split("T")[0]}
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Time</label>
              <input 
                type="time" required className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-sm"
                value={formData.time}
                onChange={(e) => setFormData({...formData, time: e.target.value})}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={submitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold shadow-md shadow-blue-200 transition-all flex justify-center items-center active:scale-[0.98]"
          >
            {submitting ? "Processing..." : "Confirm Schedule"}
          </button>
        </form>
      </div>
    </div>
  );
};

const PatientManagerPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [invoiceModal, setInvoiceModal] = useState(false);
  const [quickBookModal, setQuickBookModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [search, setSearch] = useState("");

  const isReceptionist = user?.role === "Receptionist" || user?.role === "Admin";

  useEffect(() => {
    API.get("/patients").then(res => {
      setPatients((res.data || []).reverse());
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const searchedPatients = useMemo(() => {
    const term = search.toLowerCase();
    return patients.filter(p => 
      p.Name?.toLowerCase().includes(term) || 
      String(p.Patient_ID).includes(term)
    );
  }, [search, patients]);

  const patientActions = [
    {
      label: "Profile",
      handler: (p) => navigate(`/patients/${p.Patient_ID}`),
      className: "text-slate-600 hover:text-blue-600 font-semibold text-sm",
    },
    {
      label: "Book",
      handler: (p) => { setSelectedPatient(p); setQuickBookModal(true); },
      role: "Receptionist",
      className: "text-blue-600 hover:text-blue-800 font-bold text-sm",
    },
    {
      label: "Bill",
      handler: (p) => { setSelectedPatient(p); setInvoiceModal(true); },
      role: "Receptionist",
      className: "text-emerald-600 hover:text-emerald-800 font-semibold text-sm",
    }
  ];

  const filteredActions = patientActions.filter(a => !a.role || user?.role === a.role || user?.role === "Admin");

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] p-6 lg:px-12">
      {/* --- Cleaner Header --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Patient Directory</h1>
          <p className="text-slate-500 text-sm mt-1 font-medium">Manage patient records and clinical scheduling</p>
        </div>

        <div className="flex items-center gap-3">
          {/* --- Smaller, focused Search Input --- */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon />
            </div>
            <input
              type="text" 
              placeholder="Search patients..."
              value={search} 
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm w-full md:w-64 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all shadow-sm"
            />
          </div>

          {isReceptionist && (
            <button
              onClick={() => navigate("/patients/new")}
              className="flex items-center px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-800 transition-all shadow-sm active:scale-95"
            >
              <PlusIcon /> New Patient
            </button>
          )}
        </div>
      </div>

      {/* --- Table Container --- */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="h-64 flex items-center justify-center text-slate-400 animate-pulse font-medium">Loading records...</div>
        ) : (
          <DataTable
            data={searchedPatients}
            columns={[
              { header: "ID", accessor: "Patient_ID" },
              { header: "Name", accessor: "Name" },
              { header: "Gender", accessor: "Gender" },
              { header: "Phone", accessor: "Phone" },
            ]}
            actions={filteredActions}
          />
        )}
      </div>

      {/* --- Modals --- */}
      {quickBookModal && selectedPatient && (
        <QuickBookModal patient={selectedPatient} onClose={() => setQuickBookModal(false)} />
      )}

      {invoiceModal && selectedPatient && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full">
            <BillForm selectedPatient={selectedPatient} onClose={() => setInvoiceModal(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientManagerPage;