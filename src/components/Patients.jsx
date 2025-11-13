import React, { useEffect, useState } from 'react';
import { Button } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import './Patients.css';
import DoctorSidebar from './Sidebar';

const Patients = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Get logged-in doctor name from localStorage
  const doctor = JSON.parse(localStorage.getItem('session'));
  const doctorName = doctor?.name;

  useEffect(() => {
    if (!doctorName) return;

    fetch('http://localhost:4000/appointmentlist')
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter((appt) => appt.doctorName === doctorName);
        setAppointments(filtered);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching appointment data:', err);
        setLoading(false);
      });
  }, [doctorName]);

  const handleCancel = async (id) => {
    const confirmCancel = window.confirm("Are you sure you want to cancel this appointment?");
    if (!confirmCancel) return;

    try {
      const updatedAppointments = appointments.map((p) =>
        p.id === id ? { ...p, approvalStatus: "cancelled" } : p
      );
      setAppointments(updatedAppointments);

      const appointmentToCancel = updatedAppointments.find((p) => p.id === id);
      if (!appointmentToCancel) return;

      await fetch(`http://localhost:4000/appointmentlist/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(appointmentToCancel),
      });

      alert("✅ Appointment cancelled successfully!");
    } catch (err) {
      console.error("Cancel failed:", err);
      alert("❌ Failed to cancel appointment.");
    }
  };

  const handlePatientClick = (email) => {
    if (email) {
      navigate(`/patient/${encodeURIComponent(email)}`);
    }
  };

  const formatDateOnly = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-CA'); // Format: YYYY-MM-DD
  };

  const formatSlotWithTime = (slot, timeRange) => {
    const formattedSlot = slot
      ? slot.charAt(0).toUpperCase() + slot.slice(1).toLowerCase()
      : "";
    return `(${formattedSlot} ${timeRange})`;
  };

  const formatStatus = (status) =>
    status ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase() : "";

  return (
    <div className="layout-container">
      <DoctorSidebar
        activeView="patients"
        onSelect={(view) => {
          switch (view) {
            case 'home':
              navigate('/doctor');
              break;
            case 'patients':
              navigate('/patients');
              break;
            case 'settings':
              navigate('/settings');
              break;
            default:
              break;
          }
        }}
      />
      <div className="main-content">
        <div className="patients-container">
          <h3 style={{ textAlign: 'center', marginBottom: 20, color: '#1976d2' }}>Patient Summary</h3>
          {loading ? (
            <p>Loading appointments...</p>
          ) : appointments.length === 0 ? (
            <p>No appointments found for {doctorName}</p>
          ) : (
            <table className="patients-table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Reason For Booking</th>
                  <th>Appointment Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <button
                        className="link-button"
                        onClick={() => handlePatientClick(p.email)}
                      >
                        {p.patientName}
                      </button>
                    </td>
                    <td>{p.reasonForBooking}</td>
                    <td>
                      <div>{formatDateOnly(p.appointmentDate)}</div>
                      <small>{formatSlotWithTime(p.slot, p.timeRange)}</small>
                    </td>
                    <td
                      style={{
                        color:
                          p.approvalStatus === "Approved"
                            ? "green"
                            : p.approvalStatus === "cancelled"
                            ? "red"
                            : "orange",
                        fontWeight: "bold",
                      }}
                    >
                      {formatStatus(p.approvalStatus)}
                    </td>
                    <td>
                      <Button
                        variant={p.approvalStatus === "cancelled" ? "secondary" : "danger"}
                        size="sm"
                        disabled={p.approvalStatus === "cancelled"}
                        onClick={() => handleCancel(p.id)}
                      >
                        {p.approvalStatus === "cancelled" ? "Cancelled" : "Cancel"}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Patients;