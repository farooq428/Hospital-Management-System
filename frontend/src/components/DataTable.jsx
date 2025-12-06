import React, { useState } from "react";

const DataTable = ({ columns, data, actions, title }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 8;

  const totalPages = Math.ceil(data.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentData = data.slice(startIndex, endIndex);

  return (
    <div className="w-full">
      {title && (
        <h3 className="text-lg font-semibold text-gray-700 mb-3">
          {title}
        </h3>
      )}

      <div className="overflow-x-auto rounded-xl border">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-blue-600 text-white">
            <tr>
              {columns.map((col, index) => (
                <th key={index} className="px-4 py-3 font-semibold">
                  {col.header}
                </th>
              ))}
              {actions?.length > 0 && (
                <th className="px-4 py-3 font-semibold">Actions</th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y">
            {currentData.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-blue-50">
                {columns.map((col, colIndex) => (
                  <td key={colIndex} className="px-4 py-3">
                    {col.accessor === "Status" ? (
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          row.Status === "Cancelled"
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {row.Status}
                      </span>
                    ) : (
                      row[col.accessor]
                    )}
                  </td>
                ))}

                {actions?.length > 0 && (
                  <td className="px-4 py-3">
                    {row.Status === "Cancelled" ? (
                      <span className="px-3 py-1 bg-gray-300 text-gray-700 rounded-lg text-xs font-semibold">
                        Cancelled
                      </span>
                    ) : (
                      actions.map((action, i) => (
                        <button
                          key={i}
                          onClick={() => action.handler(row)}
                          className="px-3 py-1 rounded-lg text-white text-xs font-semibold bg-red-500 hover:bg-red-600"
                        >
                          {action.label}
                        </button>
                      ))
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded bg-gray-200"
          >
            Prev
          </button>

          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded bg-gray-200"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default DataTable;
