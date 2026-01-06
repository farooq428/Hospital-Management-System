// src/components/patientProfile/DemographicsTab.jsx

const DemographicsTab = ({ data }) => {
    return (
        <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <h4 style={{borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px'}}>Personal Details</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <p><strong>Date of Birth:</strong> {data.dob}</p>
                <p><strong>Age:</strong> {data.age}</p>
                <p><strong>Gender:</strong> {data.gender}</p>
                <p><strong>Phone:</strong> {data.phone}</p>
                <p style={{gridColumn: 'span 2'}}><strong>Address:</strong> {data.address}</p>
                
                {/* Future Feature: Current Room Assignment */}
                <h4 style={{gridColumn: 'span 2', marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '10px'}}>Current Status</h4>
                <p><strong>Current Room:</strong> {data.currentRoom || 'N/A'}</p>
            </div>
        </div>
    );
};

export default DemographicsTab;