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
        <h3 className="text-xl sm:text-2xl font-bold text-gray-700 mb-4">
          {title}
        </h3>
      )}

      {/* Desktop Table */}
      <div className="hidden sm:block overflow-x-auto rounded-xl border shadow-sm">
        <table className="min-w-full text-left border-collapse">
          <thead className="bg-blue-600 text-white">
            <tr>
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className="px-4 py-3 text-sm sm:text-base font-semibold uppercase tracking-wider"
                >
                  {col.header}
                </th>
              ))}
              {actions?.length > 0 && (
                <th className="px-4 py-3 text-sm sm:text-base font-semibold uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>

          <tbody className="bg-white divide-y">
            {currentData.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="hover:bg-blue-50 transition-colors duration-200"
              >
                {columns.map((col, colIndex) => (
                  <td
                    key={colIndex}
                    className="px-4 py-3 text-sm sm:text-base text-gray-700"
                  >
                    {col.accessor === "Status" ? (
                      <span
                        className={`px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${
                          row.Status === "Cancelled"
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {row.Status || "Scheduled"}
                      </span>
                    ) : (
                      row[col.accessor]
                    )}
                  </td>
                ))}

                {actions?.length > 0 && (
                  <td className="px-4 py-3 text-sm sm:text-base">
                    {row.Status === "Cancelled" ? (
                      <span className="px-3 py-1 bg-gray-300 text-gray-700 rounded-lg text-xs sm:text-sm font-semibold">
                        Cancelled
                      </span>
                    ) : (
                      actions.map((action, i) => (
                        <button
                          key={i}
                          onClick={() => action.handler(row)}
                          className="px-3 py-1 sm:px-4 sm:py-2 rounded-lg text-white text-xs sm:text-sm font-semibold bg-red-500 hover:bg-red-600 transition-colors duration-200"
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

      {/* Mobile Card View */}
      <div className="sm:hidden space-y-4">
        {currentData.map((row, idx) => (
          <div
            key={idx}
            className="bg-white p-4 rounded-xl shadow flex flex-col space-y-2"
          >
            {columns.map((col, colIdx) => (
              <div key={colIdx} className="flex justify-between">
                <span className="font-semibold text-gray-600 text-sm">
                  {col.header}:
                </span>
                <span className="text-gray-800 text-sm">
                  {col.accessor === "Status" ? (
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        row.Status === "Cancelled"
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {row.Status || "Scheduled"}
                    </span>
                  ) : (
                    row[col.accessor]
                  )}
                </span>
              </div>
            ))}

            {actions?.length > 0 && (
              <div className="pt-2 flex flex-wrap gap-2">
                {row.Status === "Cancelled" ? (
                  <span className="px-3 py-1 bg-gray-300 text-gray-700 rounded-lg text-xs font-semibold">
                    Cancelled
                  </span>
                ) : (
                  actions.map((action, i) => (
                    <button
                      key={i}
                      onClick={() => action.handler(row)}
                      className="px-3 py-1 rounded-lg text-white text-xs font-semibold bg-red-500 hover:bg-red-600 transition-colors duration-200"
                    >
                      {action.label}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 mt-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 transition"
          >
            Previous
          </button>

          <span className="text-sm sm:text-base text-gray-600">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 transition"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default DataTable;
