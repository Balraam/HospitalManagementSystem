import React, { useState, useEffect } from "react";
import { Form, Button, Card } from "react-bootstrap";
import Sidebar from "./dashboard";

function PatientChangePassword() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: ""
  });

  const [patient, setPatient] = useState(null);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  // ✅ Load patient using name from session
  useEffect(() => {
    const session = JSON.parse(localStorage.getItem("session"));
    if (session?.name) {
      fetch(`http://localhost:4000/patients?name=${encodeURIComponent(session.name)}`)
        .then(res => res.json())
        .then(data => {
          if (data.length > 0) {
            setPatient(data[0]);
          } else {
            alert("Patient not found.");
          }
        })
        .catch(err => console.error("Failed to fetch patient:", err));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
    setMessage("");
  };

  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.currentPassword) newErrors.currentPassword = "Current password is required";
    if (!formData.newPassword) newErrors.newPassword = "New password is required";
    else if (!validatePassword(formData.newPassword)) {
      newErrors.newPassword = "Password must be 8+ characters, include uppercase, lowercase, digit, and special character";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (!patient) {
      alert("Patient not loaded.");
      return;
    }

    if (formData.currentPassword !== patient.password) {
      setErrors({ currentPassword: "Entered current password is incorrect" });
      return;
    }

    try {
      await fetch(`http://localhost:4000/patients/${patient.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...patient, password: formData.newPassword })
      });

      setMessage("✅ Your password has been changed. Please login with your new password.");
      setFormData({ currentPassword: "", newPassword: "" });
    } catch (err) {
      console.error(err);
      alert("❌ Failed to update password.");
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar on the left */}
      <div style={{ width: "250px" }}>
        <Sidebar />
      </div>

      {/* Form content in the center */}
      <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Card className="shadow-lg p-4" style={{ maxWidth: "500px", width: "100%" }}>
          <h3 className="text-center mb-4">Change Password</h3>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="currentPassword">
              <Form.Label style={{ fontWeight: "bold", textAlign: "left", display: "block" }}>
                Current Password
              </Form.Label>
              <Form.Control
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                placeholder="Enter current password"
              />
              {errors.currentPassword && <div className="text-danger">{errors.currentPassword}</div>}
            </Form.Group>

            <Form.Group className="mb-3" controlId="newPassword">
              <Form.Label style={{ fontWeight: "bold", textAlign: "left", display: "block" }}>
                New Password
              </Form.Label>
              <Form.Control
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Enter new password"
              />
              {errors.newPassword && <div className="text-danger">{errors.newPassword}</div>}
            </Form.Group>

            <div className="text-center mb-2">
              <Button variant="primary" type="submit">
                Change Password
              </Button>
            </div>

            {message && <div className="text-success text-center mt-2">{message}</div>}
          </Form>
        </Card>
      </div>
    </div>
  );
}

export default PatientChangePassword;