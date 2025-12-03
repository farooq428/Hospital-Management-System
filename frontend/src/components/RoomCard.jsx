// src/components/RoomCard.jsx
import React from 'react';

const getStatusColor = (status) => {
    switch (status) {
        case 'Available': return '#2ecc71'; // Green
        case 'Occupied': return '#e74c3c'; // Red
        case 'Maintenance': return '#f39c12'; // Orange
        default: return '#95a5a6'; // Gray
    }
};

const RoomCard = ({ room, onAction }) => {
    const cardColor = getStatusColor(room.Status);

    return (
        <div 
            onClick={() => onAction(room)}
            style={{
                border: `2px solid ${cardColor}`,
                borderRadius: '8px',
                padding: '15px',
                textAlign: 'center',
                backgroundColor: '#fff',
                boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
                cursor: 'pointer',
                transition: 'transform 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
        >
            <h4 style={{ margin: '0 0 5px 0', color: '#2c3e50' }}>Room {room.Room_ID}</h4>
            <p style={{ margin: 0, fontSize: '0.9em', color: '#7f8c8d' }}>{room.Room_Type}</p>
            <div style={{ height: '3px', background: cardColor, margin: '10px 0' }}></div>
            
            <p style={{ fontWeight: 'bold', color: cardColor, margin: '5px 0' }}>{room.Status}</p>
            
            {room.Patient_Name && (
                <p style={{ fontSize: '0.9em', margin: '5px 0 0 0' }}>
                    Patient: **{room.Patient_Name}**
                </p>
            )}
            
            <button 
                style={{ 
                    marginTop: '10px', 
                    padding: '5px 10px', 
                    background: cardColor, 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '4px' 
                }}
            >
                {room.Status === 'Available' ? 'Assign Bed' : 'Discharge Patient'}
            </button>
        </div>
    );
};

export default RoomCard;