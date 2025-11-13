import React from "react";

function HospitalOverview() {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", backgroundColor: "#ffffff" }}>
      
      {/* Main layout: Sidebar + Content */}
      <div style={{ display: "flex", flex: 1 }}>
        {/* Sidebar */}
        <div style={{
          width: "250px",
          backgroundColor: "#f8f9fa",
          padding: "20px",
          minHeight: "100vh",
          boxShadow: "0 0 5px rgba(0,0,0,0.1)"
        }}>
          {/* <Sidebar /> */}
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, padding: "40px", display: "flex", justifyContent: "center" ,paddingRight:"150px"}}>
          <div style={{
            maxWidth: "800px",
            textAlign: "center",
            backgroundColor: "#ffffff",
            padding: "30px",
            marginTop: "20px",
            boxShadow: "0 0 10px rgba(0,0,0,0.1)",
            borderRadius: "10px"
          }}>
            <h2 style={{ textAlign: 'center', marginBottom: 20, color: '#1976d2' }}>Hospital Management System</h2>
            <p style={{ fontSize: "16px", lineHeight: "1.6", color: "#333" }}>
              A Hospital Management System (HMS) is a comprehensive digital platform that integrates all aspects of hospital operations—from patient registration and appointment scheduling to billing, inventory, and staff management. It replaces manual processes with automated workflows, reducing errors and improving efficiency across departments.
            </p>
            <p style={{ fontSize: "16px", lineHeight: "1.6", color: "#333" }}>
              HMS enhances patient care by providing instant access to electronic health records, enabling timely diagnosis and treatment. It supports doctors with real-time data, streamlines communication between departments, and ensures regulatory compliance through accurate reporting and analytics.
            </p>
            <p style={{ fontSize: "16px", lineHeight: "1.6", color: "#333" }}>
              Key features include appointment management, pharmacy and inventory tracking, telemedicine integration, secure data sharing, and automated billing. These tools help hospitals reduce wait times, optimize resource allocation, and deliver a seamless experience to patients and staff alike.
            </p>
            <p style={{ fontSize: "16px", lineHeight: "1.6", color: "#333" }}>
              In today’s fast-paced healthcare environment, adopting a robust HMS is no longer optional—it’s essential. It empowers hospitals to operate smarter, respond faster, and provide better outcomes for every patient.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HospitalOverview;