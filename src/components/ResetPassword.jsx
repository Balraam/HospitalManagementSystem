import { useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import '../assets/ResetPassword.css';
import { API_BASE } from '../services/apiConfig';

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmedPassword, setConfirmedPassword] = useState('');
  const [message, setMessage] = useState('');
  const query = new URLSearchParams(useLocation().search);
  const role = query.get('role');
  const email = query.get('email');

  const handleReset = async () => {
    if (!newPassword.trim()) {
      setMessage('Please enter password.');
      return;
    }
    if (newPassword !== confirmedPassword) {
      setMessage('Passwords do not match.');
      return;
    }
    if (!role || !email) {
      setMessage('Role or email is missing.');
      return;
    }

    try {
      const res = await axios.get(`${API_BASE}/${role}?email=${email}`);
      const matchedUser = res.data.find(user => user.email === email);

      if (matchedUser) {
        await axios.patch(`${API_BASE}/${role}/${matchedUser.id}`, {
          password: newPassword,
          resetToken: null
        });
        setMessage('Password reset successful');
      } else {
        setMessage('Invalid token or email mismatch');
      }
    } catch (error) {
      console.error('Reset error:', error);
      setMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="reset-container">
      <h2 className="reset-title">Reset Password</h2>
      <input
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        placeholder="New password"
        className="reset-input"
        required
      />
      <input
        type="password"
        value={confirmedPassword}
        onChange={(e) => setConfirmedPassword(e.target.value)}
        placeholder="Confirm password"
        className="reset-input"
        required
      />
      <p className={`message ${message === 'Password reset successful' ? 'success' : 'error'}`}>
        {message}
      </p>
      <button onClick={handleReset} className="reset-button">
        Reset
      </button>
      {message === 'Password reset successful' && (
        <a href="/login" className="login-link">Go to Login</a>
      )}
    </div>
  );
}