import React, { useState } from "react";

const DataTable = ({ columns, data, actions, deleteAction }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 8;

  const totalPages = Math.ceil(data.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentData = data.slice(startIndex, endIndex);

  // ✅ Helper to render buttons safely
  const renderActions = (row) => {
    if (row.Status === "Cancelled") {
      return (
        <button
          onClick={() => deleteAction?.(row)}
          className="px-4 py-2 min-w-[100px] rounded-lg text-sm font-semibold bg-red-600 hover:bg-red-700 text-white transition"
        >
          Delete
        </button>
      );
    }

    return actions
      ?.filter((action) => !action.show || action.show(row))
      .map((action, i) =>
        action.handler ? (
          <button
            key={i}
            onClick={() => action.handler(row)}
            className={`px-3 sm:px-4 py-2 min-w-[90px] rounded-lg text-sm font-semibold transition ${
              action.label === "Delete" || action.label === "Remove"
                ? "bg-red-600 hover:bg-red-700 text-white"
                : action.label === "Invoice"
                ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {action.label}
          </button>
        ) : null
      );
  };

  return (
    <div className="w-full">

      {/* ✅ Desktop Table */}
      <div className="hidden sm:block overflow-x-auto rounded-xl border shadow-md">
        <table className="min-w-full text-left border-collapse">
          <thead className="bg-blue-700 text-white">
            <tr>
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className="px-6 py-3 text-sm font-semibold uppercase tracking-wider"
                >
                  {col.header}
                </th>
              ))}
              {actions?.length > 0 && (
                <th className="px-6 py-3 text-sm font-semibold uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>

          <tbody className="bg-white divide-y">
            {currentData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="text-center py-6 text-gray-500"
                >
                  No data available
                </td>
              </tr>
            ) : (
              currentData.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="hover:bg-blue-50 transition"
                >
                  {columns.map((col, colIndex) => (
                    <td
                      key={colIndex}
                      className="px-6 py-3 text-sm text-gray-700 whitespace-nowrap"
                    >
                      {col.Cell
                        ? col.Cell({ value: row[col.accessor], row })
                        : row[col.accessor]}
                    </td>
                  ))}

                  {actions?.length > 0 && (
                    <td className="px-6 py-3 flex flex-wrap gap-2">
                      {renderActions(row)}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ✅ Mobile Card View */}
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
                  {col.Cell
                    ? col.Cell({ value: row[col.accessor], row })
                    : row[col.accessor]}
                </span>
              </div>
            ))}

            {actions?.length > 0 && (
              <div className="pt-2 flex flex-wrap gap-2">
                {renderActions(row)}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ✅ Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 mt-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 transition"
          >
            Previous
          </button>

          <span className="text-sm text-gray-600">
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
