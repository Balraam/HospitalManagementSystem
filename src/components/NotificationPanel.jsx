import React, { useEffect, useState } from 'react';
import './NotificationPanel.css';

const formatDateTime = (isoString) => {
  const date = new Date(isoString);
  const options = {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  };
  return date.toLocaleString('en-IN', options).replace(',', ' at');
};

const NotificationPanel = ({ onClose }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/notifications')
      .then((res) => res.json())
      .then((data) => setNotifications(data.reverse())) // latest first
      .catch((err) => console.error('Failed to fetch notifications:', err));
  }, []);

  return (
    <div className="notification-panel">
      <div className="notification-header">
        <h4>Notifications</h4>
        <button onClick={onClose}>×</button>
      </div>
      <ul>
        {notifications.length === 0 ? (
          <li className="empty">No new notifications</li>
        ) : (
          notifications.map((note, index) => (
            <li key={index}>
              <strong>{note.title}</strong>
              <p>{note.message}</p>
              <span>{formatDateTime(note.timestamp)}</span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default NotificationPanel;