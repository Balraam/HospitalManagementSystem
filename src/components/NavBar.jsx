
import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export default function NavBar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  function onLogout() {
    logout();
    navigate('/login');
  }


  return (
  <nav style={{ display: 'flex', gap: 12, padding: 12, borderBottom: '1px solid #ddd' }}>
    {/* {!user && <Link to="/login">Login</Link>}
    {!user && <Link to="/register">Register</Link>} */}
     {user && user.role === 'admin' && <Link to="/admin">Admin</Link>}
     {/* {user && user.role === 'doctor' && <Link to="/doctor">Doctor</Link>}
     {user && user.role === 'patient' && <Link to="/patient">Patient</Link>}
     {user && user.role === 'admin' && <Link to="/data">Data Viewer</Link>} */}
    {user && <button onClick={onLogout}>Logout</button>}
     </nav>
  );
}
