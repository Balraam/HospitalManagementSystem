import React from 'react';
import Sidebar from '../../pages/adminCommon/Sidebar';

function AdminDashboard() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar on the left */}
      <div style={{ width: '250px', backgroundColor: '#f8f9fa' }}>
        <Sidebar />
      </div>

      {/* Centered dashboard content */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ maxWidth: '600px', textAlign: 'center' }}>
          <h1>Welcome, Admin!</h1>
          <h3>Here you can manage doctors, patients, and your profile.</h3>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
