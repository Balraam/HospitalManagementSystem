import React, { useEffect, useState } from 'react';
import './DashboardHome.css';

const DashboardHome = () => {
  const [doctorDetails, setDoctorDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const doctor = JSON.parse(localStorage.getItem('session'));
  const doctorName = doctor?.name;

  useEffect(() => {
    if (!doctorName) return;

    fetch(`http://localhost:4000/doctors?name=${encodeURIComponent(doctorName)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.length > 0) {
          setDoctorDetails(data[0]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching doctor details:", err);
        setLoading(false);
      });
  }, [doctorName]);

  return (
    <div className="dashboard-home">
      <h3 style={{ textAlign: 'center', marginBottom: 20, color: '#1976d2' }}>Doctor Dashboard</h3>
      <h3>Welcome to CityCare Hospital</h3>
      <p>
        CityCare Hospital is committed to providing compassionate and quality healthcare services.
        Our team of experienced doctors and staff ensure the best care for every patient.
      </p>

      {/* <div className="hospital-info">
        <h4>Hospital Timings</h4>
        <ul>
          <li><strong>Monday to Saturday:</strong></li>
          <li>Morning: 10:00 AM – 2:00 PM</li>
          <li>Evening: 5:00 PM – 9:00 PM</li>
          <li><strong>Sunday:</strong> Closed</li>
        </ul>
      </div> */}

      {loading ? (
        <p>Loading doctor details...</p>
      ) : doctorDetails ? (
        <div className="doctor-info">
          <h4>Doctor Information</h4>
          <p><strong>Name:</strong> {doctorDetails.name}</p>
          <p><strong>Email:</strong> {doctorDetails.email}</p>
          <p><strong>Qualification:</strong> {doctorDetails.qualification || '—'}</p>
          <p><strong>Available Days:</strong> {doctorDetails.availableDays?.join(', ') || '—'}</p>
          {Array.isArray(doctorDetails.availableSlots) && doctorDetails.availableSlots.length > 0 && (
            <>
              <p><strong>Available Slots:</strong></p>
              <ul>
                {doctorDetails.availableSlots.map((slot, index) => (
                  <li key={index}>{slot}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      ) : (
        <p>No doctor details found for "{doctorName}".</p>
      )}
    </div>
  );
};

export default DashboardHome;