import React, { useEffect, useState } from "react";
import { Card, ListGroup, Spinner, Badge } from "react-bootstrap";
import "./notifications.css";
import Sidebar from "./dashboard";

function Notifications() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Get logged-in patient name from localStorage
  const session = JSON.parse(localStorage.getItem("session"));
  const patientName = session?.name;

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        if (!patientName) {
          alert("No patient name found. Please log in.");
          setLoading(false);
          return;
        }

        // ✅ Fetch only appointments for the logged-in patient
        const res = await fetch(
          `http://localhost:4000/appointmentlist?patientName=${encodeURIComponent(patientName)}`
        );
        const data = await res.json();
        setAppointments(data);
      } catch (err) {
        console.error(err);
        alert("❌ Failed to load notifications.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [patientName]);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    if (isNaN(d)) return dateStr;
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" /> <p>Loading notifications...</p>
      </div>
    );
  }

  return (
    <div className="notifications-container">
      {/* <TopNavbar /> */}

      <div className="notifications-main">
        <div className="sidebar-wrapper">
          <Sidebar />
        </div>

        <div className="notifications-content">
          <Card className="notifications-card">
            <h2>Notifications</h2>
            {appointments.length === 0 ? (
              <p className="text-center text-muted">No notifications found.</p>
            ) : (
              <ListGroup variant="flush">
                {appointments.map((appt, index) => (
                  <ListGroup.Item key={index} className="notification-item">
                    <span>Appointment with </span>
                    <span className="doctor-name">{appt.doctorName}</span>
                    <span> on </span>
                    <span className="appointment-date">{formatDate(appt.appointmentDate)}</span>
                    <span className="slot">Slot: {capitalize(appt.slot)}</span>
                    <span className="time-range">Time: {appt.timeRange}</span>
                    <Badge
                      pill
                      className={`status ${appt.approvalStatus}`}
                      bg={
                        appt.approvalStatus === "Approved"
                          ? "success"
                          : appt.approvalStatus === "cancelled"
                          ? "danger"
                          : "warning"
                      }
                    >
                      {capitalize(appt.approvalStatus)}
                    </Badge>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </Card>
        </div>
      </div>

      {/* <Footer /> */}
    </div>
  );
}

export default Notifications;
