import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { validateEmail } from '../utils/validators';
import axios from 'axios';
import { API_BASE } from '../services/apiConfig';

export default function Login() {
  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [roleMessage, setRoleMessage] = useState('');
  const [password, setPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [loginMessage, setLoginMessage] = useState('');
  const [role, setRole] = useState('patient');

  useEffect(() => {
    const checkEmailAndRole = async () => {
      setLoginMessage('');
      if (!validateEmail(email)) {
        setEmailMessage('');
        setRoleMessage('');
        return;
      }

      try {
        const doctorRes = await axios.get(`${API_BASE}/doctors?email=${email}`);
        const patientRes = await axios.get(`${API_BASE}/patients?email=${email}`);

        const isDoctor = doctorRes.data.length > 0;
        const isPatient = patientRes.data.length > 0;

        if (!isDoctor && !isPatient && role !== 'admin') {
          setEmailMessage('Please register — email not found');
          setRoleMessage('');
        } else {
          setEmailMessage('');
          if ((role === 'doctor' && !isDoctor) || (role === 'patient' && !isPatient)) {
            setRoleMessage('Selected role is incorrect for this email');
          } else {
            setRoleMessage('');
          }
        }
      } catch (err) {
        console.error('Validation error:', err);
        setEmailMessage('');
        setRoleMessage('');
      }
    };

    checkEmailAndRole();
  }, [email, role]);

  if (user) {
    return <Navigate to={`/${user.role}`} replace />;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoginMessage('');
    setPasswordMessage('');

    if (!validateEmail(email)) {
      setEmailMessage('Enter a valid email');
      return;
    }

    if (!password.trim()) {
      setPasswordMessage('Enter your password');
      return;
    }

    const result = await login({ email, password, role });

    if (!result.ok) {
      if (result.wrongRole) {
        setRoleMessage(result.message || 'Selected role is incorrect for this email');
        return;
      }
      setLoginMessage(result.message || 'Login failed');
      return;
    }

    navigate(result.redirectTo);
  }

  return (
    <div style={{
      maxWidth: 500,
      margin: '40px auto',
      padding: 40,
      border: '1px solid #ddd',
      borderRadius: 8,
      boxShadow: '0 0 10px rgba(0,0,0,0.1)',
      backgroundColor: '#f9f9f9'
    }}>
      <h2 style={{ textAlign: 'center', marginBottom: 20, color: '#1976d2' }}>Login</h2>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 16 }}>
        <div>
          <label style={{ fontWeight: 'bold' }}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email@hospital.com"
            style={{ width: '100%', padding: 10, marginTop: 6, border: '1px solid #ccc', borderRadius: 4 }}
          />
          {emailMessage && (
            <p style={{ color: 'red', fontSize: '13px', marginTop: '6px' }}>{emailMessage}</p>
          )}
        </div>
        <div>
          <label style={{ fontWeight: 'bold' }}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            style={{ width: '100%', padding: 10, marginTop: 6, border: '1px solid #ccc', borderRadius: 4 }}
          />
          {passwordMessage && (
            <p style={{ color: 'red', fontSize: '13px', marginTop: '6px' }}>{passwordMessage}</p>
          )}
        </div>
        <div>
          <label style={{ fontWeight: 'bold' }}>Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={{ width: '100%', padding: 10, marginTop: 6, border: '1px solid #ccc', borderRadius: 4 }}
          >
            <option value="admin">Admin</option>
            <option value="doctor">Doctor</option>
            <option value="patient">Patient</option>
          </select>
          {roleMessage && (
            <p style={{ color: 'red', fontSize: '13px', marginTop: '6px' }}>{roleMessage}</p>
          )}
        </div>
        {loginMessage && (
          <p style={{ color: 'red', fontSize: '13px', marginTop: '6px' }}>{loginMessage}</p>
        )}
        <button
          type="submit"
          style={{
            width: '100%',
            padding: 12,
            background: '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            fontWeight: 'bold',
            fontSize: '16px'
          }}
        >
          Login
        </button>
        <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
          <Link to="/forgot" style={{ color: '#0d6efd', textDecoration: 'underline', fontWeight: '500' }}>Forgot password?</Link>
          <Link to="/register" style={{ color: '#0d6efd', textDecoration: 'underline', fontWeight: '500' }}>Registration</Link>
        </div>
      </form>
    </div>
  );
}
