import React, { useEffect, useState } from "react";
import "../../assets/AddEditPaitentForm.css";
import { API_BASE } from "../../services/apiConfig";


const AddEditPaitentForm = ({ patient, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "Default@123",
    phone: "",
    profilePhoto: null,
    address: "",
    city: "",
    state: "",
    pincode: "",
    bloodGroup: "",
    allergies: "",
    conditions: "",
    medications: "",
    emergencyContact: "",
  });

  const [errors, setErrors] = useState({});
  const [emailAvailable] = useState(true);

  useEffect(() => {
    if (patient && patient.id) {
      // Edit mode → load patient data
      setFormData(patient);
    } else {
      // Add mode → reset defaults
      setFormData({
        name: "",
        email: "",
        password: "Default@123",
        phone: "",
        profilePhoto: null,
        address: "",
        city: "",
        state: "",
        pincode: "",
        bloodGroup: "",
        allergies: "",
        conditions: "",
        medications: "",
        emergencyContact: "",
      });
    }
  }, [patient]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      profilePhoto: e.target.files[0],
    }));
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Full name is required";
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone must be 10 digits";
    }
    if (!formData.emergencyContact) {
      newErrors.emergencyContact = "Emergency contact is required";
    } else if (!/^\d{10}$/.test(formData.emergencyContact)) {
      newErrors.emergencyContact = "Emergency contact must be 10 digits";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm() || !emailAvailable) return;

    try {
      const isEdit = patient && patient.id;
      const url = isEdit
      ? `${API_BASE}/patients/${patient.id}`   
      : `${API_BASE}/patients`;  
      const method = isEdit ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const savedPatient = await response.json();
        alert(isEdit ? "Patient updated successfully!" : "Patient registered successfully!");
        if (onSave) onSave(savedPatient);
      } else {
        alert("Failed to save patient. Try again later.");
      }
    } catch (error) {
      console.error("Network error:", error);
      alert("Network error. Please check your connection.");
    }
  };
return (
  <div className="layout" style={{ display: 'flex', minHeight: '100vh' }}>
    <div style={{ flex: 1, padding: '30px', display: 'flex', justifyContent: 'center' }}>
      <div className="form-container" style={{ width: '100%', maxWidth: '800px' }}>
        <form onSubmit={handleSubmit}>
          <h2 style={{ marginBottom: '20px' }}>
            {patient && patient.id ? "Edit Patient" : "Add New Patient"}
          </h2>

          <input
            type="text"
            name="name"
            className="form-feilds"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          {errors.name && <span className="error">{errors.name}</span>}

          <input
            type="email"
            name="email"
            className="form-feilds"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={!!(patient && patient.id)}
          />
          {errors.email && <span className="error">{errors.email}</span>}

          <input
            type="password"
            name="password"
            className="form-feilds"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            disabled
          />

          <input
            type="tel"
            name="phone"
            className="form-feilds"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
          {errors.phone && <span className="error">{errors.phone}</span>}

          <input
            type="file"
            name="profilePhoto"
            className="form-feilds"
            accept="image/*"
            onChange={handleFileChange}
          />

          <input
            type="text"
            name="address"
            className="form-feilds"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
          />

          <div className="form-row" style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              name="city"
              className="form-feilds"
              placeholder="City"
              value={formData.city}
              onChange={handleChange}
            />
            <input
              type="text"
              name="state"
              className="form-feilds"
              placeholder="State"
              value={formData.state}
              onChange={handleChange}
            />
            <input
              type="text"
              name="pincode"
              className="form-feilds"
              placeholder="Pincode"
              value={formData.pincode}
              onChange={handleChange}
            />
          </div>

          <div className="form-row" style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              name="bloodGroup"
              className="form-feilds"
              placeholder="Blood Group"
              value={formData.bloodGroup}
              onChange={handleChange}
            />
            <input
              type="text"
              name="allergies"
              className="form-feilds"
              placeholder="Allergies"
              value={formData.allergies}
              onChange={handleChange}
            />
          </div>

          <input
            type="text"
            name="conditions"
            className="form-feilds"
            placeholder="Medical Conditions"
            value={formData.conditions}
            onChange={handleChange}
          />

          <input
            type="text"
            name="medications"
            className="form-feilds"
            placeholder="Medications"
            value={formData.medications}
            onChange={handleChange}
          />

          <input
            type="tel"
            name="emergencyContact"
            className="form-feilds"
            placeholder="Emergency Contact"
            value={formData.emergencyContact}
            onChange={handleChange}
            required
          />
          {errors.emergencyContact && (
            <span className="error">{errors.emergencyContact}</span>
          )}

          <div className="form-actions" style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
            <button type="submit" className="submit-btn">
              {patient && patient.id ? "Update Patient" : "Add New Patient"}
            </button>
            {onCancel && (
              <button
                type="button"
                className="cancel-btn"
                onClick={onCancel}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  </div>
);
};

export default AddEditPaitentForm;