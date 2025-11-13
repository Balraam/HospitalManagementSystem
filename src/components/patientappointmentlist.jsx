import React, { useEffect, useState } from "react";
import { Table, Button, Container, Card, Spinner } from "react-bootstrap";
import Sidebar from "./dashboard"; // Sidebar component

function AppointmentList() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Get logged-in patient name from session stored in localStorage
  const session = JSON.parse(localStorage.getItem("session"));
  const patientName = session?.name;

  useEffect(() => {
    if (!patientName) {
      alert("No patient name found. Please log in.");
      setLoading(false);
      return;
    }

    // ✅ Fetch appointments filtered by patientName
    fetch(`http://localhost:4000/appointmentlist?patientName=${encodeURIComponent(patientName)}`)
      .then((res) => res.json())
      .then((data) => {
        setAppointments(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching appointments:", err);
        alert("❌ Failed to load appointments.");
        setLoading(false);
      });
  }, [patientName]);

  const formatStatus = (status) =>
    status ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase() : "";

  const formatSlot = (slot) =>
    slot ? slot.charAt(0).toUpperCase() + slot.slice(1).toLowerCase() : "";

  const handleCancel = async (id) => {
    const confirmCancel = window.confirm("Are you sure you want to cancel this appointment?");
    if (!confirmCancel) return;

    const updatedAppointments = appointments.map((appt) =>
      appt.id === id ? { ...appt, approvalStatus: "Cancelled" } : appt
    );
    setAppointments(updatedAppointments);

    const appointmentToCancel = updatedAppointments.find((appt) => appt.id === id);
    if (!appointmentToCancel) return;

    await fetch(`http://localhost:4000/appointmentlist/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(appointmentToCancel),
    });

    alert("✅ Appointment cancelled successfully!");
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" /> <p>Loading Appointments...</p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
    
      {/* Main layout: Sidebar + Content */}
      <div style={{ display: "flex", flex: 1 }}>
        {/* Sidebar on the left */}
        <div style={{ width: "250px", backgroundColor: "#f8f9fa" }}>
          <Sidebar />
        </div>

        {/* Main content on the right */}
        <div style={{ flex: 1, display: "flex", justifyContent: "center", padding: "30px" }}>
          <Container fluid style={{ maxWidth: "1100px" }}>
            <Card style={{ padding: "20px", boxShadow: "0 0 10px rgba(0,0,0,0.1)", minWidth: "1000px" }}>
              <h2 style={{ textAlign: 'center', marginBottom: 20, color: '#1976d2' }}>
                Appointment List
              </h2>

              {appointments.length === 0 ? (
                <p className="text-center text-muted">No appointments found.</p>
              ) : (
                <Table striped bordered hover responsive>
                  <thead className="table-primary text-center">
                    <tr>
                      <th>Doctor Name</th>
                      <th>Specialization</th>
                      <th>Reason for Booking</th>
                      <th>Appointment Date</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody className="text-center">
                    {appointments.map((appt) => (
                      <tr key={appt.id}>
                        <td>{appt.doctorName}</td>
                        <td>{appt.speciality}</td>
                        <td>{appt.reasonForBooking}</td>
                        <td>
                          <div>{appt.appointmentDate}</div>
                          <small>({formatSlot(appt.slot)} {appt.timeRange})</small>
                        </td>
                        <td
                          style={{
                            color:
                              appt.approvalStatus === "Approved"
                                ? "green"
                                : appt.approvalStatus === "Cancelled"
                                ? "red"
                                : "orange",
                            fontWeight: "bold",
                          }}
                        >
                          {formatStatus(appt.approvalStatus)}
                        </td>
                        <td>
                          <Button
                            variant={appt.approvalStatus === "Cancelled" ? "secondary" : "danger"}
                            size="sm"
                            disabled={appt.approvalStatus === "Cancelled"}
                            onClick={() => handleCancel(appt.id)}
                          >
                            {appt.approvalStatus === "Cancelled" ? "Cancelled" : "Cancel"}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card>
          </Container>
        </div>
      </div>
    </div>
  );
}

export default AppointmentList;
