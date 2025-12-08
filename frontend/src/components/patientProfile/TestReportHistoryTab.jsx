import React, { useState, useEffect } from 'react';
// Assuming you have an API config file for fetching data
import API from '../../api/config'; 

const TestReportHistoryTab = ({ data, patientId }) => {
  const [reports, setReports] = useState(data);

  useEffect(() => {
    setReports(data);
  }, [data]);

  // Enhanced Print Logic to print ONLY the specific card and strip buttons
  const handlePrintSingle = (id) => {
    const printContent = document.getElementById(`print-report-section-${id}`);
    if (!printContent) return;

    // 1. Clone the content to modify it without affecting the live DOM
    const printClone = printContent.cloneNode(true);
    
    // 2. Select and remove all elements with the 'no-print' class from the clone
    const noPrintElements = printClone.querySelectorAll('.no-print');
    noPrintElements.forEach(el => el.remove());

    // 3. Use the cleaned clone's HTML for printing
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printClone.outerHTML;
    
    // Add temporary inline print styling for clarity
    const style = document.createElement('style');
    style.innerHTML = `
      body { margin: 0; padding: 0; }
      div[id^="print-report-section-"] { width: 100%; border: none !important; box-shadow: none !important; }
    `;
    document.head.appendChild(style);

    window.print();
    
    // Clean up and restore
    document.head.removeChild(style);
    document.body.innerHTML = originalContents;
    window.location.reload(); // Reload to restore React event listeners
  };


  // Placeholder for Delete function (requires API implementation)
  const handleDelete = async (reportId) => {
      if (!window.confirm("Are you sure you want to delete this report?")) return;
      
      // *** API DELETION LOGIC GOES HERE ***
      
      try {
        // Example: await API.delete(`/reports/${reportId}`); 
        setReports((prev) => prev.filter((r) => r.Report_ID !== reportId));
        alert("Report deleted successfully. (Placeholder Action)");
      } catch (err) {
        // console.error(err);
        alert("Failed to delete report. (Placeholder Action)");
      }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-2 bg-gray-50 min-h-full">
      <h4 className="font-bold text-lg text-gray-800 mb-4 text-center">
        Test Report History <span className="text-gray-500 text-sm">({reports.length})</span>
      </h4>

      {reports.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 bg-white rounded shadow-sm border border-gray-200">
            <p className="text-gray-500 text-sm">No test reports found for this patient.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((r) => (
            <div 
              key={r.Report_ID} 
              id={`print-report-section-${r.Report_ID}`} // Unique ID for print function
              className="bg-white rounded shadow border border-gray-300 overflow-hidden"
            >
              
              <div className="p-3">
                {/* Header Row - Compact */}
                <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-2">
                    <div className="flex items-center gap-2">
                        <h2 className="text-sm font-bold text-gray-800 leading-tight">Report: {r.Type || "N/A"}</h2>
                        <p className="text-[10px] text-gray-500">ID: {r.Report_ID}</p>
                    </div>
                    <div className="text-right">
                        <span className="text-xs font-semibold text-gray-700">
                            Date: {new Date(r.Date).toLocaleDateString("en-GB", { year: "numeric", month: "short", day: "numeric" })}
                        </span>
                    </div>
                </div>

                {/* Report Details - Compact */}
                <div className="bg-gray-50 p-2 rounded text-xs mb-3">
                  <div className="space-y-1">
                    <p className="font-medium text-gray-800 leading-snug">
                        <span className="text-gray-500 font-bold mr-1 uppercase text-[10px]">Summary:</span>
                        {r.Result_Summary || r.Result || "No detailed summary available."}
                    </p>
                    {/* Placeholder for more complex results if needed */}
                  </div>
                </div>
              </div>

              {/* BUTTONS: BOTTOM CENTER (Now includes Print) */}
              <div className="no-print bg-gray-50 border-t border-gray-200 py-1.5 flex justify-center items-center gap-3">
                
                {/* Delete Button */}
                <button
                  onClick={() => handleDelete(r.Report_ID)}
                  className="flex items-center gap-1 px-3 py-1 bg-white text-red-600 border border-red-200 rounded hover:bg-red-50 text-xs font-medium shadow-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </button>

                {/* Download Button */}
                <a
                  href={`http://localhost:5000/api/v1/reports/${r.Report_ID}/download`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 px-3 py-1 bg-teal-600 text-white border border-teal-600 rounded hover:bg-teal-700 text-xs font-medium shadow-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download
                </a>

                {/* Print Button (New consistent feature) */}
                <button
                  onClick={() => handlePrintSingle(r.Report_ID)}
                  className="flex items-center gap-1 px-3 py-1 bg-white text-gray-600 border border-gray-300 rounded hover:bg-gray-100 text-xs font-medium shadow-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Print
                </button>
                
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Styles for print hiding buttons */}
      <style>
        {`@media print {
          .no-print { display: none !important; }
        }`}
      </style>
    </div>
  );
};

export default TestReportHistoryTab;