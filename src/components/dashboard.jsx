import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaHome,
  FaCalendarCheck,
  FaClipboardList,
  FaBell,
  FaUserCircle,
  FaCog,
} from "react-icons/fa";
import patientImage from "../assets/Patientlogo.png";
import "./dashboard.css";

function Sidebar() {
  const [patientName, setPatientName] = useState("Loading...");

  useEffect(() => {
    const session = JSON.parse(localStorage.getItem("session"));
    if (session?.name) {
      setPatientName(session.name);
    } else {
      setPatientName("Unknown Patient");
    }
  }, []);

  return (
    <aside className="sidebar">
      <div className="profile-section">
        <img src={patientImage} alt="Patient" className="profile-pic" />
        <h4 className="patient-name">{patientName}</h4>
      </div>

      <ul className="sidebar-links">
        <li>
          <Link to="/dashboard">
            <FaHome /> Dashboard
          </Link>
        </li>
        <li>
          <Link to="/book">
            <FaCalendarCheck /> Book Appointment
          </Link>
        </li>
        <li>
          <Link to="/appointments">
            <FaClipboardList /> Appointment List
          </Link>
        </li>
        <li>
          <Link to="/notifications">
            <FaBell /> Notifications
          </Link>
        </li>
        <li>
          <Link to="/patientprofile">
            <FaUserCircle /> View/Update Profile
          </Link>
        </li>
        <li>
          <Link to="/patientchangepassword">
            <FaCog /> Change Password
          </Link>
        </li>
      </ul>
    </aside>
  );
}

export default Sidebar;
// // src/components/Sidebar.jsx
// import React, { useEffect, useState } from "react";
// import { Link, useLocation } from "react-router-dom";
// import {
//   FaHome,
//   FaCalendarCheck,
//   FaClipboardList,
//   FaBell,
//   FaUserCircle,
//   FaCog,
// } from "react-icons/fa";
// import patientImage from "../assets/patientPic.png";
// import "./dashboard.css";
 
// function Sidebar() {
//   const [patientName, setPatientName] = useState("Loading...");
//   const location = useLocation();
 
//   // Email and role will come from the login page when you navigate
//   const userEmail = location.state?.email;
//   const userRole = location.state?.role;
 
//   useEffect(() => {
//     if (!userEmail || !userRole) {
//       setPatientName("Unknown Patient");
//       return;
//     }
 
//     const fetchUserName = async () => {
//       try {
//         let endpoint = "";
 
//         // choose endpoint based on role
//         if (userRole === "patient") endpoint = "patients";
//         else if (userRole === "doctor") endpoint = "doctors";
//         else if (userRole === "admin") endpoint = "admins";
 
//         const res = await fetch(`http://localhost:4000/${endpoint}`);
//         const data = await res.json();
 
//         const matchedUser = data.find((user) => user.email === userEmail);
 
//         if (matchedUser) {
//           setPatientName(matchedUser.name);
//         } else {
//           setPatientName("Unknown Patient");
//         }
//       } catch (err) {
//         console.error("Error fetching user:", err);
//         setPatientName("Error loading name");
//       }
//     };
 
//     fetchUserName();
//   }, [userEmail, userRole]);
 
//   return (
//     <aside className="sidebar">
//       <div className="profile-section">
//         <img src={patientImage} alt="Patient" className="profile-pic" />
//         <h4 className="patient-name">{patientName}</h4>
//       </div>
 
//       <ul className="sidebar-links">
//         <li>
//           <Link to="/dashboard">
//             <FaHome /> Dashboard
//           </Link>
//         </li>
//         <li>
//           <Link to="/book">
//             <FaCalendarCheck /> Book Appointment
//           </Link>
//         </li>
//         <li>
//           <Link to="/appointments">
//             <FaClipboardList /> Appointment List
//           </Link>
//         </li>
//         <li>
//           <Link to="/notifications">
//             <FaBell /> Notifications
//           </Link>
//         </li>
//         <li>
//           <Link to="/profile">
//             <FaUserCircle /> View/Update Profile
//           </Link>
//         </li>
//         <li>
//           <Link to="/change-password">
//             <FaCog /> Change Password
//           </Link>
//         </li>
//       </ul>
//     </aside>
//   );
// }
 
// export default Sidebar;
// import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import {
//   FaHome,
//   FaCalendarCheck,
//   FaClipboardList,
//   FaBell,
//   FaUserCircle,
//   FaCog
// } from 'react-icons/fa';
// import patientImage from "../assets/patientPic.png";

// const Sidebar = () => {
//   const [name, setName] = useState("");

//   useEffect(() => {
//     fetch("http://localhost:4000/patients")
//       .then(res => res.json())
//       .then(data => {
//         if (data.length > 0 && data[0].name) {
//           setName(data[0].name);
//         }
//       })
//       .catch(err => {
//         console.error("Error fetching patient name:", err);
//       });
//   }, []);

//   const styles = {
//     container: {
//       display: 'flex',
//       minHeight: '100vh',
//       overflow: 'hidden',
//     },
//     sidebar: {
//       width: '250px',
//       backgroundColor: '#2c3e50',
//       padding: '20px',
//       flexShrink: 0,
//       height: '100vh',
//       position: 'sticky',
//       top: 0,
//       overflowY: 'auto',
//     },
//     content: {
//       flexGrow: 1,
//       padding: '20px',
//       overflowY: 'auto',
//     },
//     profileSection: {
//       textAlign: 'center',
//       marginBottom: '20px',
//     },
//     profilePic: {
//       width: '80px',
//       height: '80px',
//       borderRadius: '50%',
//     },
//     patientName: {
//       marginTop: '10px',
//       fontSize: '18px',
//       fontWeight: 'bold',
//     },
//     linkList: {
//       listStyle: 'none',
//       padding: 0,
//     },
//     linkItem: {
//       margin: '15px 0',
//     },
//     link: {
//       textDecoration: 'none',
//       color: '#333',
//       display: 'flex',
//       alignItems: 'center',
//       fontSize: '16px',
//     },
//     icon: {
//       marginRight: '8px',
//     }
//   };

//   return (
//     <div style={styles.container}>
//       <aside style={styles.sidebar}>
//         <div style={styles.profileSection}>
//           <img src={patientImage} alt="Patient" style={styles.profilePic} />
//           <h4 style={styles.patientName}>{name}</h4>
//         </div>

//         <ul style={styles.linkList}>
//           <li style={styles.linkItem}>
//             <Link to="/dashboard" style={styles.link}>
//               <FaHome style={styles.icon} />
//               Dashboard
//             </Link>
//           </li>
//           <li style={styles.linkItem}>
//             <Link to="/book" style={styles.link}>
//               <FaCalendarCheck style={styles.icon} />
//               Book an Appointment
//             </Link>
//           </li>
//           <li style={styles.linkItem}>
//             <Link to="/appointments" style={styles.link}>
//               <FaClipboardList style={styles.icon} />
//               Appointment List
//             </Link>
//           </li>
//           <li style={styles.linkItem}>
//             <Link to="/notifications" style={styles.link}>
//               <FaBell style={styles.icon} />
//               Notifications
//             </Link>
//           </li>
//           <li style={styles.linkItem}>
//             <Link to="/profile" style={styles.link}>
//               <FaUserCircle style={styles.icon} />
//               View/Update Profile
//             </Link>
//           </li>
//           <li style={styles.linkItem}>
//             <Link to="/changepassword" style={styles.link}>
//               <FaCog style={styles.icon} />
//               Change Password
//             </Link>
//           </li>
//         </ul>
//       </aside>

//       <main style={styles.content}>
//         {/* Replace this with your actual page content */}
//         <h2>Welcome to the Dashboard</h2>
//         <p>This is where your main content will go. Add routes or components here.</p>
//       </main>
//     </div>
//   );
// };

// export default Sidebar;
// import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import {
//   FaHome,
//   FaCalendarCheck,
//   FaClipboardList,
//   FaBell,
//   FaUserCircle,
//   FaCog,
//   FaSignOutAlt
// } from 'react-icons/fa';
// import patientImage from "../assets/patientPic.png";
// import './dashboard.css';

// const Sidebar = () => {
//   const [fullName, setfullName] = useState("");

//   useEffect(() => {
//     fetch("http://localhost:4000/patients")
//       .then(res => res.json())
//       .then(data => {
//         if (data.length > 0) {
//           setfullName(data[0].fullName); // assuming first patient is the logged-in one
//         }
//       })
//       .catch(err => {
//         console.error("Error fetching patient name:", err);
//       });
//   }, []);

//   return (
//     <aside className="sidebar">
//       <div className="profile-section">
//         <img src={patientImage} alt="Patient" className="profile-pic" />
//         <h4 className="patient-name">{fullName || "Loading..."}</h4>
//       </div>

//       <ul className="sidebar-links">
//         <li>
//           <Link to="/dashboard">
//             <FaHome style={{ marginRight: '8px' }} />
//             Dashboard
//           </Link>
//         </li>
//         <li>
//           <Link to="/book">
//             <FaCalendarCheck style={{ marginRight: '8px' }} />
//             Book an Appointment
//           </Link>
//         </li>
//         <li>
//           <Link to="/appointments">
//             <FaClipboardList style={{ marginRight: '8px' }} />
//             Appointment List
//           </Link>
//         </li>
//         <li>
//           <Link to="/notifications">
//             <FaBell style={{ marginRight: '8px' }} />
//             Notifications
//           </Link>
//         </li>
//         <li>
//           <Link to="/profile">
//             <FaUserCircle style={{ marginRight: '8px' }} />
//             View/Update Profile
//           </Link>
//         </li>
//         <li>
//           <Link to="/reset-password/:token">
//             <FaCog style={{ marginRight: '8px' }} />
//             Change Password
//           </Link>
//         </li>
//       </ul>
//     </aside>
//   );
// };

// export default Sidebar;
// import React from 'react';
// import { Link } from 'react-router-dom';
// import { FaHome, FaCalendarCheck, FaClipboardList, FaBell, FaUserCircle, FaCog, FaSignOutAlt } from 'react-icons/fa';
// import patientImage from "../assets/patientPic.png"
// import './dashboard.css'; // Make sure your CSS styles are loaded

// const Sidebar = () => {
//   return (
//     <aside className="sidebar">
//        <div className="profile-section">
//         <img src={patientImage} alt="Patient" className="profile-pic" />
//         <h4 className="patient-name">Sai Sri Harsha Kolipakula </h4>
//       </div>


//       <ul className="sidebar-links">
//         <li>
//           <Link to="/dashboard">
//             <FaHome style={{ marginRight: '8px' }} />
//             Dashboard
//           </Link>
//         </li>
//         <li>
//           <Link to="/book">
//             <FaCalendarCheck style={{ marginRight: '8px' }} />
//             Book an Appointment
//           </Link>
//         </li>
//         <li>
//           <Link to="/appointments">
//             <FaClipboardList style={{ marginRight: '8px' }} />
//             Appointment List
//           </Link>
//         </li>
//         <li>
//           <Link to="/notifications">
//             <FaBell style={{ marginRight: '8px' }} />
//             Notifications
//           </Link>
//         </li>
//         <li>
//           <Link to="/profile">
//             <FaUserCircle style={{ marginRight: '8px' }} />
//             View/Update Profile
//           </Link>
//         </li>
//          <li>
//           <Link to="/changepassword">
//             <FaCog style={{ marginRight: '8px' }} />
//             Change Password
//           </Link>
//         </li>
//          {/* <li>
//           <Link to="/login">
//             <FaSignOutAlt style={{ marginRight: '8px' }} />
//             Log Out
//           </Link>
//         </li> */}
//       </ul>
//     </aside>
//   );
// };

// export default Sidebar;
