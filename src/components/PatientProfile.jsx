import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col, Card } from "react-bootstrap";
import Sidebar from "./dashboard";


function PatientProfile() {
  const [patient, setPatient] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    bloodGroup: "",
    emergencyContact: ""
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

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
            alert("Patient not found in database.");
          }
          setLoading(false);
        })
        .catch(err => {
          console.error("Failed to fetch patient profile:", err);
          setLoading(false);
        });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPatient({ ...patient, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const validate = () => {
    const newErrors = {};
    if (!patient.name.trim()) newErrors.name = "Name is required";
    if (!patient.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(patient.email)) newErrors.email = "Invalid email format";

    if (!patient.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!/^\d{10}$/.test(patient.phone)) newErrors.phone = "Phone must be 10 digits";

    if (!patient.bloodGroup.trim()) newErrors.bloodGroup = "Blood group is required";
    if (!patient.address.trim()) newErrors.address = "Address is required";
    if (!patient.city.trim()) newErrors.city = "City is required";
    if (!patient.state.trim()) newErrors.state = "State is required";

    if (!patient.pincode.trim()) newErrors.pincode = "Pincode is required";
    else if (!/^\d{6}$/.test(patient.pincode)) newErrors.pincode = "Pincode must be 6 digits";

    if (!patient.emergencyContact.trim()) newErrors.emergencyContact = "Emergency contact is required";
    else if (!/^\d{10}$/.test(patient.emergencyContact)) newErrors.emergencyContact = "Must be 10 digits";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const res = await fetch(`http://localhost:4000/patients?name=${encodeURIComponent(patient.name)}`)
        .then(res => res.json());

      if (res.length === 0) {
        alert("Patient not found for update.");
        return;
      }

      const patientToUpdate = res[0];

      await fetch(`http://localhost:4000/patients/${patientToUpdate.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patient)
      });

      alert("✅ Patient Profile updated successfully!");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to update profile.");
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* <TopNavbar /> */}
      <div style={{ display: "flex", flex: 1 }}>
        <div style={{ width: "250px", backgroundColor: "#f8f9fa" }}>
          <Sidebar />
        </div>

        <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "flex-start", padding: "30px" }}>
          {/* <Container> */}
            <Card className="shadow-lg p-4" style={{ minWidth: "700px" }}>
              <h2 style={{ textAlign: 'center', marginBottom: 20, color: '#1976d2' }}>Patient Profile</h2>
              <Form onSubmit={handleSubmit}>
                {[
                  { label: "Full Name", name: "name", type: "text" },
                  { label: "Email", name: "email", type: "email" },
                  { label: "Phone Number", name: "phone", type: "text" },
                  { label: "Blood Group", name: "bloodGroup", type: "text" },
                  { label: "Address", name: "address", type: "text" },
                  { label: "City", name: "city", type: "text" },
                  { label: "State", name: "state", type: "text" },
                  { label: "Pincode", name: "pincode", type: "text" },
                  { label: "Emergency Contact", name: "emergencyContact", type: "text" }
                ].map((field, idx) => (
                  <Row className="mb-3" key={idx}>
                    <Col md={12}>
                      <Form.Group controlId={field.name}>
                        <Form.Label style={{ fontWeight: "bold", textAlign: "left", display: "block" }}>
                          {field.label}
                        </Form.Label>
                        <Form.Control
                          type={field.type}
                          name={field.name}
                          value={patient[field.name]}
                          onChange={handleChange}
                        />
                        {errors[field.name] && <div className="text-danger">{errors[field.name]}</div>}
                      </Form.Group>
                    </Col>
                  </Row>
                ))}

                <div className="text-center">
                  <Button variant="primary" type="submit">
                    Update Profile
                  </Button>
                </div>
              </Form>
            </Card>
          {/* </Container> */}
        </div>
      </div>
      {/* <Footer /> */}
    </div>
  );
}

export default PatientProfile;