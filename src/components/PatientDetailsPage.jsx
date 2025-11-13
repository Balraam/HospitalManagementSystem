import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../assets/PatientDetails.css';
import DoctorSidebar from './Sidebar';

const PatientDetailsPage = () => {
  const { email } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);

  useEffect(() => {
    fetch('http://localhost:4000/appointmentlist')
      .then(res => res.json())
      .then(data => {
        const matched = data.find(p => p.email.toLowerCase() === email.toLowerCase());
        setPatient(matched || null);
      })
      .catch(err => console.error('Error fetching patient details:', err));
  }, [email]);

  if (!patient) return <p className="not-found">Patient not found.</p>;

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
      <div className="patient-details-container">
        <h3 style={{ textAlign: 'center', marginBottom: 20, color: '#1976d2' }}>Patient Details</h3>
        <table className="patient-details-table">
          <thead>
            <tr>
              <th>Field</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Name</td><td>{patient.fullName}</td></tr>
            <tr><td>Email</td><td>{patient.email}</td></tr>
            <tr><td>Phone</td><td>{patient.phone}</td></tr>
            <tr><td>Address</td><td>{patient.address}</td></tr>
            <tr><td>City</td><td>{patient.city}</td></tr>
            <tr><td>State</td><td>{patient.state}</td></tr>
            <tr><td>Pincode</td><td>{patient.pincode}</td></tr>
            <tr><td>Blood Group</td><td>{patient.bloodGroup}</td></tr>
            <tr><td>Allergies</td><td>{patient.allergies}</td></tr>
            <tr><td>Conditions</td><td>{patient.conditions}</td></tr>
            <tr><td>Medications</td><td>{patient.medications}</td></tr>
            <tr><td>Emergency Contact</td><td>{patient.emergencyContact}</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PatientDetailsPage;
