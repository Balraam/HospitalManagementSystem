import React, { useState, useEffect } from 'react';
import { getAdminById, updateAdmin } from '../../services/adminprofileservice';
import Sidebar from '../../pages/adminCommon/Sidebar';

function ChangePassword() {
  const adminId = "1"; // Static ID for demo
  const [admin, setAdmin] = useState(null);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    const fetchAdmin = async () => {
      const data = await getAdminById(adminId);
      setAdmin(data);
    };
    fetchAdmin();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!admin) return;

    if (oldPassword !== admin.password) {
      alert("❌ Incorrect current password.");
      return;
    }

    try {
      const updatedAdmin = { ...admin, password: newPassword };
      await updateAdmin(adminId, updatedAdmin);
      alert("✅ Password updated successfully!");
      setOldPassword('');
      setNewPassword('');
    } catch (error) {
      console.error("Error updating password:", error);
      alert("❌ Failed to update password.");
    }
  };

  return (
  <div style={{ display: 'flex', minHeight: '100vh' }}>
    {/* Sidebar on the left */}
    <div style={{ width: '250px', backgroundColor: '#f8f9fa' }}>
      <Sidebar />
    </div>

    {/* Form content beside sidebar */}
    <div style={{ flex: 1, padding: '30px', display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: '600px' }}>
        <h2 style={{ marginBottom: '20px' }}>Change Password</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ fontWeight: 'bold' }}>Current Password</label>
            <input
              type="password"
              className="form-control"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
              style={{ marginTop: '5px' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ fontWeight: 'bold' }}>New Password</label>
            <input
              type="password"
              className="form-control"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              style={{ marginTop: '5px' }}
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Update Password
          </button>
        </form>
      </div>
    </div>
  </div>
);
}

export default ChangePassword;
