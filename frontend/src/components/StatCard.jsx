// src/components/StatCard.jsx
import React from 'react';

const StatCard = ({ title, value, icon }) => {
    return (
        <div style={{ 
            flex: 1, 
            padding: '20px', 
            borderRadius: '8px', 
            background: '#fff', 
            boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
            borderLeft: '5px solid #3498db', // Using your logo's blue color
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        }}>
            <div>
                <p style={{ margin: 0, fontSize: '0.9em', color: '#777' }}>{title}</p>
                <h3 style={{ margin: '5px 0 0 0', fontSize: '2em', color: '#333' }}>{value}</h3>
            </div>
            <span style={{ fontSize: '2em', color: '#3498db' }}>{icon}</span>
        </div>
    );
};

export default StatCard;