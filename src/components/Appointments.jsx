import React, { useEffect, useState } from 'react';
import './Appointments.css';

const Appointments = () => {
  const [bookings, setBookings] = useState([]);
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  

  // Fetch appointment bookings and patient data
  useEffect(() => {
    // Fetch bookings
    fetch('http://localhost:4000/appointmentlist')
      .then((res) => res.json())
      .then((data) => {
        setBookings(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching appointment bookings:', err);
        setLoading(false);
      });

    // Fetch patients
    fetch('http://localhost:4000/patients')
      .then((res) => res.json())
      .then((data) => setPatients(data))
      .catch((err) => console.error('Error fetching patients:', err));
  }, []);

  const filteredBookings = data.filter(
          (booking) =>
            booking.doctorName &&
            booking.doctorName.trim().toLowerCase() === doctorName.trim().toLowerCase()
        );
        setBookings(filteredBookings);
        setLoading(false);

  // Format date
  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  // Handle patient name click
  const handlePatientClick = (name) => {
    const patient = patients.find(
      (p) => p.fullName.trim().toLowerCase() === name.trim().toLowerCase()
    );
    setSelectedPatient(patient || null);
  };

  return (
    <div className="appointments-container">
      <h3>Appointment Bookings</h3>

      {loading ? (
        <p>Loading bookings...</p>
      ) : bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <table className="appointments-table">
          <thead>
            <tr>
              <th>Patient</th>
              <th>Reason For Booking</th>
              <th>Appointment Date</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td>
                  <button
                    className="link-button"
                    onClick={() => handlePatientClick(booking.patientName)}
                  >
                    {booking.patientName}
                  </button>
                </td>
                <td>{booking.symptoms}</td>
                <td>{formatDateTime(booking.appointmentDate)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selectedPatient && (
        <div className="patient-details">
          <h4>Patient Details</h4>
          <p><strong>Name:</strong> {selectedPatient.fullName}</p>
          <p><strong>Email:</strong> {selectedPatient.email}</p>
          <p><strong>Phone:</strong> {selectedPatient.phone}</p>
          <p><strong>Address:</strong> {selectedPatient.address}, {selectedPatient.city}, {selectedPatient.state} - {selectedPatient.pincode}</p>
          <p><strong>Blood Group:</strong> {selectedPatient.bloodGroup}</p>
          <p><strong>Allergies:</strong> {selectedPatient.allergies}</p>
          <p><strong>Conditions:</strong> {selectedPatient.conditions}</p>
          <p><strong>Medications:</strong> {selectedPatient.medications}</p>
          <p><strong>Emergency Contact:</strong> {selectedPatient.emergencyContact}</p>
        </div>
      )}
    </div>
  );
};

export default Appointments;