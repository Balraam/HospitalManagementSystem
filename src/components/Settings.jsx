import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import doctorImage from '../assets/doctor.jpg';
import './Settings.css';
import DoctorSidebar from './Sidebar';

const Settings = () => {
  const [selectedOption, setSelectedOption] = useState('profile');
   const navigate = useNavigate();

  const handlePasswordChange = (e) => {
    e.preventDefault();
    alert('Password changed successfully!');
  };

  return (
    <div className="layout-container"> {/* ✅ Flex layout for sidebar + content */}
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
      
    <div className="settings-wrapper">
      <div className="settings-sidebar">
        <h3>Settings</h3>
        <ul>
          <li
            className={selectedOption === 'profile' ? 'active' : ''}
            onClick={() => setSelectedOption('profile')}
          >
            View Profile
          </li>
          <li
            className={selectedOption === 'password' ? 'active' : ''}
            onClick={() => setSelectedOption('password')}
          >
            Change Password
          </li>
        </ul>
      </div>

      <div className="settings-content">
        {selectedOption === 'profile' && (
          <div className="card profile-card">
            <img
             // src={`${process.env.PUBLIC_URL}/doctor.jpg`}
              src={doctorImage}
              alt="Dr. Marttin Deo"
              className="doctor-image"
            />
            <h3>Dr. Marttin Deo</h3>
            <p><strong>Qualification:</strong> MBBS, FCPS - MD (Medicine), MCPS</p>
            <p><strong>Email:</strong> marttin.deo@hospital.com</p>
            <p><strong>Phone:</strong> +91-9876543210</p>
          </div>
        )}

        {selectedOption === 'password' && (
          <form className="card password-card" onSubmit={handlePasswordChange}>
            <div className="form-group">
              <label>Old Password</label>
              <input type="password" required />
            </div>
            <div className="form-group">
              <label>New Password</label>
              <input type="password" required />
            </div>
            <div className="form-group">
              <label>Confirm New Password</label>
              <input type="password" required />
            </div>
            <button type="submit">Change Password</button>
          </form>
        )}
      </div>
    </div>
    </div>
  );
};

export default Settings;