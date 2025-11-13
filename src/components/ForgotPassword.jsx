
import { useState } from 'react';
import axios from 'axios';
import '../assets/ForgotPassword.css';
import { API_BASE } from '../services/apiConfig';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [resetLink, setResetLink] = useState('');

  const handleSubmit = async () => {
    if (email.trim() === '') {
      setMessage('Please enter your email.');
      setResetLink('');
      return;
    }

    try {
      // Check in doctors API
      const doctorRes = await axios.get(`${API_BASE}/doctors?email=${email}`);
      if (doctorRes.data.length > 0) {
        const token = Math.random().toString(36).slice(2);
        await axios.patch(`${API_BASE}/doctors/${doctorRes.data[0].id}`, {
          resetToken: token
        });
        setMessage('Reset link generated successfully.');
        setResetLink(`/reset-password/${token}?role=doctors&email=${email}`);
        return;
      }

      // Check in patients API
      const patientRes = await axios.get(`${API_BASE}/patients?email=${email}`);
      if (patientRes.data.length > 0) {
        const token = Math.random().toString(36).slice(2);
        await axios.patch(`${API_BASE}/patients/${patientRes.data[0].id}`, {
          resetToken: token
        });
        setMessage('Reset link generated successfully.');
        setResetLink(`/reset-password/${token}?role=patients&email=${email}`);
        return;
      }

      setMessage('Email not found');
      setResetLink('');
    } catch (error) {
      console.error('Error during password reset:', error);
      setMessage('An error occurred. Please try again later.');
      setResetLink('');
    }
  };

  return (
    <div className="forgot-container">
      <h2 className="forgot-title">Forgot Password</h2>
      <input
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Enter email"
        className="forgot-input"
      />
      <p className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
        {message}
      </p>
      {resetLink && (
        <p className="reset-link">
          <a href={resetLink}>Click here to reset</a>
        </p>
      )}
      <button onClick={handleSubmit} className="forgot-button">
        Send Reset Link
      </button>
    </div>
  );
}

