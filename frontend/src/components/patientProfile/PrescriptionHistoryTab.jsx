import React from "react";

const PrescriptionHistoryTab = ({ data }) => {
  return (
    <div>
      <h4 className="font-bold mb-3">
        Prescription Records ({data.length})
      </h4>

      {data.length === 0 ? (
        <p>No prescription history found.</p>
      ) : (
        <ul className="list-disc pl-6">
          {data.map((p) => (
            <li key={p.Prescription_ID} className="mb-2">
              {p.Date} - {p.Medicines_List} ({p.Dosage}, {p.Duration})  
              <span className="ml-2 text-blue-600">
                Doctor: {p.Doctor_Name || p.Employee_ID}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PrescriptionHistoryTab;
