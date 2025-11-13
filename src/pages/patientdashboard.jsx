import React from "react";
import Sidebar from "../components/dashboard";// Your sidebar component
import bodyImage from "../assets/bodyImage.jpg";

function PatientDashboard() {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>

      {/* Main layout: Sidebar + Content */}
      <div style={{ display: "flex", flex: 1 }}>
        {/* Sidebar */}
        <div style={{ width: "250px", backgroundColor: "#f8f9fa" }}>
          <Sidebar />
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, position: "relative" }}>
          <img
            src={bodyImage}
            alt="Dashboard"
            style={{
              width: "110%",
              height: "100%",
              objectFit: "cover",
              filter: "brightness(80%)",
              position: "absolute",
              paddingRight:"50px",
              top: 0,
              left: 0,
              zIndex: 0
            }}
          />
          <div
            style={{
              position: "relative",
              zIndex: 1,
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <h1
              style={{
                color: "white",
                fontWeight: "bold",
                textShadow: "2px 2px 6px rgba(0,0,0,0.7)"
              }}
            >
              Welcome, Patient!
            </h1>
          </div>
        </div>
      </div>

    </div>
  );
}

export default PatientDashboard;