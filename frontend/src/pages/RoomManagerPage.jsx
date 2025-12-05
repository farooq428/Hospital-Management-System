import React, { useState } from 'react';
import StatCard from '../components/StatCard'; // ✅ Import StatCard
import RoomCard from '../components/RoomCard'; // ✅ Import RoomCard component
import RoomAssignmentForm from '../components/forms/RoomAssignmentForm'; // ✅ Import assignment form

const mockRooms = [
    { Room_ID: 101, Room_Type: 'General', Status: 'Occupied', Patient_ID: 1001, Patient_Name: 'Elizabeth Swan' },
    { Room_ID: 102, Room_Type: 'General', Status: 'Available', Patient_ID: null, Patient_Name: null },
    { Room_ID: 201, Room_Type: 'ICU', Status: 'Occupied', Patient_ID: 1005, Patient_Name: 'Trillian Astra' },
    { Room_ID: 202, Room_Type: 'ICU', Status: 'Maintenance', Patient_ID: null, Patient_Name: null },
    { Room_ID: 301, Room_Type: 'Private', Status: 'Available', Patient_ID: null, Patient_Name: null },
    { Room_ID: 302, Room_Type: 'Private', Status: 'Occupied', Patient_ID: 1006, Patient_Name: 'Marvin Android' },
];

const RoomManagerPage = () => {
    const [rooms, setRooms] = useState(mockRooms);
    const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState(null);

    // Dashboard counts
    const availableCount = rooms.filter(r => r.Status === 'Available').length;
    const occupiedCount = rooms.filter(r => r.Status === 'Occupied').length;

    const handleRoomAction = (room) => {
        setSelectedRoom(room);
        if (room.Status === 'Available') {
            setIsAssignmentModalOpen(true);
        } else if (room.Status === 'Occupied') {
            if (window.confirm(`Room ${room.Room_ID} is occupied by ${room.Patient_Name}. Discharge patient?`)) {
                handleDischarge(room.Room_ID);
            }
        }
    };

    const handleDischarge = (roomId) => {
        setRooms(prevRooms => prevRooms.map(room => 
            room.Room_ID === roomId ? { ...room, Status: 'Available', Patient_ID: null, Patient_Name: null } : room
        ));
        alert(`Patient discharged from Room ${roomId}. Room is now available.`);
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1 style={{ color: '#1abc9c' }}>Room and Bed Management</h1>

            {/* Dashboard Stats */}
            <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
                <StatCard title="Total Rooms" value={rooms.length} icon="🏠" color="#2c3e50" />
                <StatCard title="Available Beds" value={availableCount} icon="🟢" color="#2ecc71" />
                <StatCard title="Occupied Beds" value={occupiedCount} icon="🔴" color="#e74c3c" />
            </div>

            {/* Room Overview */}
            <h3>Room Status Overview</h3>
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
                gap: '20px' 
            }}>
                {rooms.map(room => (
                    <RoomCard key={room.Room_ID} room={room} onAction={handleRoomAction} />
                ))}
            </div>

            {/* Room Assignment Modal */}
            {isAssignmentModalOpen && selectedRoom && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div style={{ background: 'white', padding: '30px', borderRadius: '8px', width: '400px' }}>
                        <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px' }}>
                            Assign Patient to Room {selectedRoom.Room_ID}
                        </h3>
                        <RoomAssignmentForm room={selectedRoom} onAssign={() => setIsAssignmentModalOpen(false)} />
                        <button onClick={() => setIsAssignmentModalOpen(false)} style={{ marginTop: '15px' }}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RoomManagerPage;
