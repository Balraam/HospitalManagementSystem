import React from 'react';
import "../assets/Header.css";
import { FaBell } from 'react-icons/fa';
 
 
const Header = ({ onNotificationClick }) => {
  return (
    <header className="header">
      <h2>Doctor Dashboard</h2>
      <div className="header-icons" onClick={onNotificationClick}>
        <FaBell title="Notifications" />
      </div>
    </header>
  );
};
 
export default Header;