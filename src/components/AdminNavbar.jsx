import React from "react";
import { Link } from "react-router-dom";
import '../assets/AdminNavbar.css';

function AdminNavbar() {
  return (
    <nav className="navbar">
      <h2 className="navbar-logo">Admin Panel</h2>
      <ul className="navbar-links">
        
        <li><Link to="/admin-profile">Admin Profile</Link></li>
        <li><Link to="/doctor-list">Doctor Details</Link></li>
        <li><Link to="/patients">Patient Details</Link></li>
        <li><Link to="/appointment-list">Appointment Lists</Link></li>
        <li><Link to="/change-password">Change Password</Link></li>
        
      </ul>
    </nav>
  );
}

export default AdminNavbar;
