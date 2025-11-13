import React, { useState, useEffect } from 'react';
import Sidebar from '../../pages/adminCommon/Sidebar';
import { FaBell } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { API_BASE } from '../../services/apiConfig';

function AppointmentList() {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpeciality, setSelectedSpeciality] = useState('');
  const [specialities, setSpecialities] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Count unread notifications
  useEffect(() => {
    const count = appointments.reduce((acc, app) => {
      const unread = app.notifications?.filter(n => !n.read).length || 0;
      return acc + unread;
    }, 0);
    setUnreadCount(count);
  }, [appointments]);

  // Fetch appointments
  useEffect(() => {
    fetch(`${API_BASE}/appointmentlist`)
      .then(res => res.json())
      .then(data => {
        setAppointments(data);
        setFilteredAppointments(data);
        const uniqueSpecialities = [...new Set(data.map(app => app.speciality))];
        setSpecialities(uniqueSpecialities);
      })
      .catch(err => console.error('Failed to fetch appointments:', err));
  }, []);

  // Filter appointments
  useEffect(() => {
    const filtered = appointments.filter(app => {
      const matchesSearch =
        app.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.doctorName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSpeciality = selectedSpeciality ? app.speciality === selectedSpeciality : true;
      return matchesSearch && matchesSpeciality;
    });
    setFilteredAppointments(filtered);
  }, [searchTerm, selectedSpeciality, appointments]);

  const handleSearch = e => setSearchTerm(e.target.value);

  // ✅ Fixed handleApproval
  const handleApproval = async (id, status, patientName, doctorName) => {
    try {
      const response = await fetch(`${API_BASE}/appointmentlist/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approvalStatus: status })
      });

      if (!response.ok) throw new Error('Failed to update on server');

      toast.success(`Appointment ${status} for ${patientName} with ${doctorName}`);

      const updated = appointments.map(app =>
        app.id === id ? { ...app, approvalStatus: status } : app
      );
      setAppointments(updated);
      setFilteredAppointments(updated); // ✅ Update filtered list too
    } catch (err) {
      console.error('Approval failed:', err);
      toast.error('Failed to update appointment status.');
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <ToastContainer position="top-right" autoClose={3000} />
      <div style={{ color: 'gold', position: 'absolute', top: '20px', right: '330px' }}>
        <FaBell
          size={24}
          onClick={() => setShowNotifications(!showNotifications)}
          style={{ cursor: 'pointer' }}
        />
        {unreadCount > 0 && (
          <span
            style={{
              position: 'absolute',
              top: '-5px',
              right: '-5px',
              backgroundColor: 'red',
              color: 'white',
              borderRadius: '50%',
              padding: '2px 6px',
              fontSize: '12px'
            }}
          >
            {unreadCount}
          </span>
        )}
        {showNotifications && (
          <div
            style={{
              position: 'absolute',
              top: '30px',
              right: '0',
              width: '300px',
              backgroundColor: '#fff',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              borderRadius: '8px',
              zIndex: 1000,
              maxHeight: '400px',
              overflowY: 'auto'
            }}
          >
            <div style={{ padding: '10px', borderBottom: '1px solid #eee', fontWeight: 'bold' }}>
              Notifications
            </div>
            {appointments.flatMap(app => app.notifications || []).length > 0 ? (
              appointments.flatMap(app => app.notifications || []).map((note, index) => (
                <div key={index} style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
                  <div>{note.message}</div>
                  <small style={{ color: '#888' }}>{new Date(note.timestamp).toLocaleString()}</small>
                </div>
              ))
            ) : (
              <div style={{ padding: '10px', textAlign: 'center', color: '#888' }}>
                No notifications
              </div>
            )}
          </div>
        )}
      </div>

      <div style={{ width: '250px', backgroundColor: '#f8f9fa' }}>
        <Sidebar />
      </div>

      <div style={{ flex: 1, padding: '30px', display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: '1100px' }}>
          <h2 style={{ marginBottom: '20px' }}>Manage Appointments</h2>

          {/* Search and Filter */}
          <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
            <input
              type="text"
              placeholder="Search by doctor/patient name..."
              value={searchTerm}
              onChange={handleSearch}
              style={{ flex: 1, padding: '8px' }}
            />
            <div className="dropdown-box">
              <select value={selectedSpeciality} onChange={e => setSelectedSpeciality(e.target.value)}>
                <option value="">All Specialities</option>
                {specialities.map(s => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f0f0f0' }}>
                <th style={{ padding: '10px', border: '1px solid #ccc' }}>Patient Name</th>
                <th style={{ padding: '10px', border: '1px solid #ccc' }}>Doctor Name</th>
                <th style={{ padding: '10px', border: '1px solid #ccc' }}>Specialization</th>
                <th style={{ padding: '10px', border: '1px solid #ccc' }}>Reason</th>
                <th style={{ padding: '10px', border: '1px solid #ccc' }}>Date & Time</th>
                <th style={{ padding: '10px', border: '1px solid #ccc' }}>Status</th>
                <th style={{ padding: '10px', border: '1px solid #ccc' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map(app => (
                  <tr key={app.id}>
                    <td style={{ padding: '10px', border: '1px solid #ccc' }}>{app.patientName}</td>
                    <td style={{ padding: '10px', border: '1px solid #ccc' }}>{app.doctorName}</td>
                    <td style={{ padding: '10px', border: '1px solid #ccc' }}>{app.speciality}</td>
                    <td style={{ padding: '10px', border: '1px solid #ccc' }}>{app.reasonForBooking}</td>
                    <td style={{ padding: '10px', border: '1px solid #ccc' }}>
                      {app.appointmentDate}
                      <br />
                      <small>({app.timeRange})</small>
                    </td>
                    <td style={{ padding: '10px', border: '1px solid #ccc' }}>
                      <span
                        style={{
                          padding: '4px 8px',
                          borderRadius: '4px',
                          backgroundColor:
                            app.approvalStatus === 'Approved'
                              ? '#d4edda'
                              : app.approvalStatus === 'Cancelled'
                              ? '#f8d7da'
                              : '#fff3cd',
                          color:
                            app.approvalStatus === 'Approved'
                              ? '#155724'
                              : app.approvalStatus === 'Cancelled'
                              ? '#721c24'
                              : '#856404',
                          fontWeight: 'bold'
                        }}
                      >
                        {app.approvalStatus}
                      </span>
                    </td>
                    <td style={{ padding: '10px', border: '1px solid #ccc' }}>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                          style={{
                            padding: '6px 12px',
                            backgroundColor: '#28a745',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: app.approvalStatus === 'Approved' ? 'not-allowed' : 'pointer',
                            opacity: app.approvalStatus === 'Approved' ? 0.6 : 1
                          }}
                          onClick={() =>
                            handleApproval(app.id, 'Approved', app.patientName, app.doctorName)
                          }
                          disabled={app.approvalStatus === 'Approved'}
                        >
                          Approve
                        </button>
                        <button
                          style={{
                            padding: '6px 12px',
                            backgroundColor: '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: app.approvalStatus === 'Cancelled' ? 'not-allowed' : 'pointer',
                            opacity: app.approvalStatus === 'Cancelled' ? 0.6 : 1
                          }}
                          onClick={() =>
                            handleApproval(app.id, 'Cancelled', app.patientName, app.doctorName)
                          }
                          disabled={app.approvalStatus === 'Cancelled'}
                        >
                          Cancel
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ padding: '10px', textAlign: 'center' }}>
                    No appointments found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AppointmentList;