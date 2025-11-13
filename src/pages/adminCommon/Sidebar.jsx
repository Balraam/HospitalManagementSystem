import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaHome,
  FaClipboardList,
  FaUserCircle,
  FaCog,
} from "react-icons/fa";

const Sidebar = () => {
  return (
    <>
      <style>{`
        
 .sidebar-links li {
  margin: 20px 0;
  padding-left: 30px;
}

.sidebar-links a {
  text-decoration: none;
  color: white;
  font-size: 16px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: color 0.3s ease;
}
  .sidebar-profile {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 30px;
        }
.sidebar-avatar {
          width: 120px;
          height: 120px;
          border-radius: 70%;
          object-fit: cover;
          margin-bottom: 10px;
          border: 2px solid #ccc;
        }


.sidebar-links a:hover {
  color: #90e0ef;
}

.icon {
  font-size: 18px;
} 
        }
      `}
      </style>

      <aside className="sidebar">
        {/* Profile Section */}
        <div className="sidebar-profile">
          <img
            src="/admin.webp" // Place this image in your public folder
            alt="Admin"
            className="sidebar-avatar"
          />
          
        </div>

        {/* Navigation Links */}
        <ul className="sidebar-links">
          <li><Link to="/admin-dashboard"><FaHome /> Dashboard</Link></li>
          <li><Link to="/doctor-list"><FaClipboardList /> Manage Doctors</Link></li>
          <li><Link to="/paitent-list"><FaClipboardList /> Manage Patients</Link></li>
          <li><Link to="/appointment-list"><FaClipboardList /> Manage Appointments</Link></li>
          <li><Link to="/adminprofile"><FaUserCircle /> Profile</Link></li>
          <li><Link to="/admin/change-password"><FaCog /> Change Password</Link></li>
        </ul>
      </aside>
    </>
  );
};

export default Sidebar;
// // src/adminCommon/Sidebar.js
// import React from 'react';
// import { Link } from 'react-router-dom';
// import '../../components/dashboard.css';
// import {
//   FaHome,
//   FaCalendarCheck,
//   FaClipboardList,
//   FaBell,
//   FaUserCircle,
//   FaCog,
// } from "react-icons/fa";

// const Sidebar = () => {
//   return (
//     <aside className="sidebar">
//       <ul className="sidebar-links">
//         <li><Link to="/admin-dashboard"><FaHome />Dashboard</Link></li>
//         <li><Link to="/doctor-list"> <FaClipboardList /> Manage Doctors</Link></li>
//         <li><Link to="/paitent-list"> <FaClipboardList /> Manage Patients</Link></li>
//         <li><Link to="/appointment-list"> <FaClipboardList /> Manage Appointments</Link></li>
//         <li><Link to="/adminprofile"> <FaUserCircle /> Profile</Link></li>
//         <li><Link to="/admin/change-password"> <FaCog /> Change Password</Link></li>
//       </ul>
//     </aside>
//   );
// };

// export default Sidebar;