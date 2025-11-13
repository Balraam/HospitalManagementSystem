
import React from 'react';
import {
  FaCog,
  FaHome,
  FaUserCircle,
  FaUserInjured
} from 'react-icons/fa';
import { Link } from "react-router-dom";
import doctorImage from '../assets/doctorlogo.jpg';
import '../components/Sidebar.css';

const DoctorSidebar = () => {
  
  // Get doctor info from localStorage
  const doctor = JSON.parse(localStorage.getItem('session'));


  return (
    <aside className="sidebar">
      <div className="profile-section">
        <img
          src={doctor?.profilePic || doctorImage}
          alt={doctor?.name || "Doctor"}
          className="profile-pic"
        />
        <h4>{doctor?.name || "Loading..."}</h4>
        <p>{doctor?.qualification || ""}</p>
      </div>

      <ul className="sidebar-links">
        <li>
          <Link to="/doctor">
            <FaHome /> Dashboard
          </Link>
        </li>
        <li>
          <Link to="/patients">
            <FaUserInjured /> Patient Appointments
          </Link>
        </li>
        <li>
          <Link to="/doctorprofile">
            <FaUserCircle /> View/Update Profile
          </Link>
        </li>
        <li>
        <Link to="/doctorchangepassword">
          <FaCog /> Change Password
          </Link>
        </li>
      </ul>
    </aside>
  );
};

export default DoctorSidebar;
