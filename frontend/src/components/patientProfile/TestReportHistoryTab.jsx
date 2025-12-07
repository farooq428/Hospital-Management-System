import React from "react";

const TestReportHistoryTab = ({ data }) => {
  return (
    <div>
      <h4 className="font-bold mb-3">
        Test Report History ({data.length})
      </h4>

      {data.length === 0 ? (
        <p>No test reports found.</p>
      ) : (
        <div className="space-y-3">
          {data.map((r) => (
            <div key={r.Report_ID} className="border p-3 rounded shadow-sm">
              <p><strong>Date:</strong> {r.Date}</p>
              <p><strong>Type:</strong> {r.Type}</p>
              <p><strong>Summary:</strong> {r.Result_Summary}</p>

              <a
                href={`http://localhost:5000/api/v1/reports/${r.Report_ID}/download`}
                target="_blank"
                rel="noreferrer"
                className="inline-block mt-2 bg-green-600 text-white px-3 py-1 rounded"
              >
                Download Report
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TestReportHistoryTab;
