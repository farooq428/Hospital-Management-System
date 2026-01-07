import React, { useState, useEffect } from 'react';
import API from '../../api/config';

const TestReportHistoryTab = ({ data = [], patientId }) => {
  const [reports, setReports] = useState(data);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    setReports(data);
  }, [data]);

  // Print only the selected report using a print window
  const handlePrintSingle = (id) => {
    const printContent = document.getElementById(`print-report-section-${id}`);
    if (!printContent) return;

    const printWindow = window.open('', '', 'width=800,height=600');
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Report</title>
          <style>
            body { margin: 0; padding: 0; font-family: sans-serif; }
            .no-print { display: none !important; }
            .print-card { width: 100%; border: none !important; box-shadow: none !important; }
          </style>
        </head>
        <body>
          <div class="print-card">
            ${printContent.innerHTML}
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  // Delete report from database and update UI
  const handleDelete = async (reportId) => {
    if (!window.confirm("Are you sure you want to delete this report?")) return;
    setDeletingId(reportId);
    try {
      await API.delete(`/reports/${reportId}`);
      setReports((prev) => prev.filter((r) => r.Report_ID !== reportId));
    } catch (err) {
      alert("Failed to delete report.");
    } finally {
      setDeletingId(null);
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
              id={`print-report-section-${r.Report_ID}`}
              className="bg-white rounded shadow border border-gray-300 overflow-hidden"
            >
              <div className="p-3">
                {/* Header Row */}
                <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-2">
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-bold text-gray-800 leading-tight">
                      Report: {r.Type || "N/A"}
                    </h2>
                    <p className="text-[10px] text-gray-500">ID: {r.Report_ID}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold text-gray-700">
                      Date: {new Date(r.Date).toLocaleDateString("en-GB", { year: "numeric", month: "short", day: "numeric" })}
                    </span>
                  </div>
                </div>
                {/* Report Details */}
                <div className="bg-gray-50 p-2 rounded text-xs mb-3">
                  <div className="space-y-1">
                    <p className="font-medium text-gray-800 leading-snug">
                      <span className="text-gray-500 font-bold mr-1 uppercase text-[10px]">Summary:</span>
                      {r.Result_Summary || r.Result || "No detailed summary available."}
                    </p>
                  </div>
                </div>
              </div>
              {/* Action Buttons */}
              <div className="no-print bg-gray-50 border-t border-gray-200 py-1.5 flex justify-center items-center gap-3">
                <button
                  onClick={() => handleDelete(r.Report_ID)}
                  className="flex items-center gap-1 px-3 py-1 bg-white text-red-600 border border-red-200 rounded hover:bg-red-50 text-xs font-medium shadow-sm"
                  disabled={deletingId === r.Report_ID}
                >
                  {deletingId === r.Report_ID ? (
                    <span className="animate-spin mr-1">&#9696;</span>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  )}
                  Delete
                </button>
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
      <style>
        {`@media print { .no-print { display: none !important; } }`}
      </style>
    </div>
  );
};

export default TestReportHistoryTab;