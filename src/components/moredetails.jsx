import React, { useEffect, useState } from "react";
import { Card, Row, Col } from "react-bootstrap";

function DashboardOverview() {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    Promise.all([
      fetch("http://localhost:4000/doctors").then(res => res.json()),
      fetch("http://localhost:4000/patients").then(res => res.json()),
      fetch("http://localhost:4000/appointmentlist").then(res => res.json())
    ])
    .then(([doctors, patients, appointments]) => {
      setStats([
        {
          title: "Patients Registered",
          value: patients.length,
          bg: "#e3f2fd",
          color: "#0d6efd"
        },
        {
          title: "Doctors Available",
          value: doctors.length,
          bg: "#fce4ec",
          color: "#d63384"
        },
        {
          title: "Appointments Booked",
          value: appointments.length,
          bg: "#e8f5e9",
          color: "#198754"
        }
      ]);
    })
    .catch(err => console.error("Error fetching dashboard data:", err));
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f4f6f8",
        padding: "20px"
      }}
    >
      <div style={{ maxWidth: "800px", width: "100%", textAlign: "center" , justifyContent:"center"}}>
        <h2 style={{ textAlign: 'center', marginBottom: 20, color: '#1976d2' }}>
          Hospital Dashboard Overview
        </h2>
<div style ={{justifyContent:"center"}}>
        <Row xs={1} md={2} lg={2} className="g-4">
          {stats.map((stat, idx) => (
            <Col key={idx}>
              <Card
                style={{
                  backgroundColor: stat.bg,
                  border: "none",
                  borderRadius: "12px",
                  padding: "20px",
                  textAlign: "center",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.05)"
                }}
              >
                <Card.Title style={{ fontSize: "18px", color: stat.color }}>
                  {stat.title}
                </Card.Title>
                <Card.Text style={{ fontSize: "36px", fontWeight: "bold", color: stat.color }}>
                  {stat.value}
                </Card.Text>
              </Card>
            </Col>
          ))}
        </Row>
</div>
        <p style={{ marginTop: "40px", fontSize: "16px", lineHeight: "1.6", color: "#555" }}>
          This dashboard provides a quick snapshot of hospital operations. It helps administrators monitor patient registrations, doctor availability, and appointment activity in real-time.
        </p>
      </div>
    </div>
  );
}

export default DashboardOverview;