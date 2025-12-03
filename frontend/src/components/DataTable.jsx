// src/components/DataTable.jsx
import React, { useState } from 'react';

// --- STYLING (Inline or use CSS/MUI later) ---
const tableStyles = {
    width: '100%',
    borderCollapse: 'collapse',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    borderRadius: '8px',
    overflow: 'hidden',
    marginTop: '15px'
};

const headerStyles = {
    background: '#3498db', // EasyCare Blue
    color: 'white',
    padding: '12px 15px',
    textAlign: 'left',
    fontSize: '0.9em',
    fontWeight: '600'
};

const rowStyles = {
    borderBottom: '1px solid #ecf0f1',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
};

const cellStyles = {
    padding: '12px 15px',
    textAlign: 'left',
    color: '#34495e'
};

const DataTable = ({ columns, data, onRowClick, actions, title }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10; // Fixed pagination size for simplicity

    // Pagination Logic
    const totalPages = Math.ceil(data.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const currentData = data.slice(startIndex, endIndex);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    return (
        <div className="data-table-container">
            {title && <h3 style={{ marginBottom: '10px', color: '#2c3e50' }}>{title}</h3>}
            
            <table style={tableStyles}>
                <thead>
                    <tr>
                        {columns.map((col, index) => (
                            <th key={index} style={headerStyles}>
                                {col.header}
                            </th>
                        ))}
                        {/* Column for actions (View, Edit, Delete) */}
                        {actions && actions.length > 0 && <th style={headerStyles}>Actions</th>}
                    </tr>
                </thead>
                <tbody>
                    {currentData.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length + (actions ? 1 : 0)} style={{ ...cellStyles, textAlign: 'center' }}>
                                No data available.
                            </td>
                        </tr>
                    ) : (
                        currentData.map((row, rowIndex) => (
                            <tr 
                                key={startIndex + rowIndex} 
                                style={{ ...rowStyles, backgroundColor: (startIndex + rowIndex) % 2 === 0 ? '#f9f9f9' : 'white' }}
                                onClick={onRowClick ? () => onRowClick(row) : null}
                            >
                                {columns.map((col, colIndex) => (
                                    <td key={colIndex} style={cellStyles}>
                                        {/* Display data using the accessor key */}
                                        {row[col.accessor]}
                                    </td>
                                ))}

                                {/* Actions Cell */}
                                {actions && actions.length > 0 && (
                                    <td style={cellStyles}>
                                        {actions.map((action, actionIndex) => (
                                            <button 
                                                key={actionIndex} 
                                                onClick={(e) => { 
                                                    e.stopPropagation(); // Prevents row click when button is clicked
                                                    action.handler(row); 
                                                }}
                                                style={{ ...action.style, padding: '5px 10px', marginRight: '5px' }}
                                            >
                                                {action.label}
                                            </button>
                                        ))}
                                    </td>
                                )}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div style={{ padding: '15px 0', textAlign: 'center' }}>
                    <button 
                        onClick={() => handlePageChange(currentPage - 1)} 
                        disabled={currentPage === 1}
                        style={{ padding: '8px 15px', margin: '0 5px' }}
                    >
                        Previous
                    </button>
                    <span>Page {currentPage} of {totalPages}</span>
                    <button 
                        onClick={() => handlePageChange(currentPage + 1)} 
                        disabled={currentPage === totalPages}
                        style={{ padding: '8px 15px', margin: '0 5px' }}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default DataTable;