import React, { useEffect, useState } from 'react';
import { Form, Button, Card, Spinner } from 'react-bootstrap';
import DoctorSidebar from './Sidebar';

function DoctorChangePassword() {
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [currentPasswordError, setCurrentPasswordError] = useState('');
  const [newPasswordError, setNewPasswordError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const session = JSON.parse(localStorage.getItem('session'));
  const doctorName = session?.name;

  useEffect(() => {
    if (!doctorName) return;

    fetch(`http://localhost:4000/doctors?name=${encodeURIComponent(doctorName)}`)
      .then(res => res.json())
      .then(data => {
        const doc = data[0];
        if (doc) {
          setDoctor(doc);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching doctor:', err);
        setLoading(false);
      });
  }, [doctorName]);

  const validateNewPassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const handleUpdatePassword = async () => {
    setCurrentPasswordError('');
    setNewPasswordError('');
    setSuccessMessage('');

    if (!doctor?.id) {
      alert("Doctor ID not found.");
      return;
    }

    if (currentPassword !== doctor.password) {
      setCurrentPasswordError("Current password is incorrect.");
      return;
    }

    if (!validateNewPassword(newPassword)) {
      setNewPasswordError("Password must be at least 8 characters and include one digit, one uppercase letter, one lowercase letter, and one special character.");
      return;
    }

    try {
      await fetch(`http://localhost:4000/doctors/${doctor.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...doctor, password: newPassword })
      });
      setSuccessMessage("✅ Password has been changed. Please login now.");
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      console.error("Update failed:", err);
      alert("❌ Failed to update password.");
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
        <p>Loading doctor data...</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <div style={{ width: '250px', backgroundColor: '#f8f9fa' }}>
        <DoctorSidebar />
      </div>

      <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Card style={{ padding: '20px', width: '100%', maxWidth: '600px' }}>
          <h3 style={{ textAlign: 'center', marginBottom: 20, color: '#1976d2' }}>Change Password</h3>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Current Password</Form.Label>
              <Form.Control
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                isInvalid={!!currentPasswordError}
              />
              <Form.Control.Feedback type="invalid">
                {currentPasswordError}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                isInvalid={!!newPasswordError}
              />
              <Form.Control.Feedback type="invalid">
                {newPasswordError}
              </Form.Control.Feedback>
            </Form.Group>

            <div className="text-center mt-4">
              <Button variant="primary" onClick={handleUpdatePassword}>Change Password</Button>
            </div>

            {successMessage && (
              <div className="text-success text-center mt-3">
                {successMessage}
              </div>
            )}
          </Form>
        </Card>
      </div>
    </div>
  );
}

export default DoctorChangePassword;