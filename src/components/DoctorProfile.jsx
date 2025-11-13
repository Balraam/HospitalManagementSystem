import React, { useEffect, useState } from 'react';
import { Form, Button, Card, Spinner } from 'react-bootstrap';
import DoctorSidebar from './Sidebar';

const allDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const allSlots = ['10AM - 12PM', '12PM - 2PM', '3PM - 5PM', '5PM - 7PM', '7PM - 9PM'];

function DoctorProfile() {
  const [doctor, setDoctor] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);

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
          setFormData({
            name: doc.name || '',
            email: doc.email || '',
            phone: doc.phone || '',
            address: doc.address || '',
            state: doc.state || '',
            city: doc.city || '',
            pincode: doc.pincode || '',
            speciality: doc.speciality || '',
            qualification: doc.qualification || '',
            yearsOfExp: doc.yearsOfExp || '',
            availableDays: Array.isArray(doc.availableDays) ? doc.availableDays : [],
            availableSlots: Array.isArray(doc.availableSlots) ? doc.availableSlots : []
          });
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching doctor:', err);
        setLoading(false);
      });
  }, [doctorName]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (field, value) => {
    setFormData(prev => {
      const current = Array.isArray(prev[field]) ? prev[field] : [];
      const updated = current.includes(value)
        ? current.filter(item => item !== value)
        : [...current, value];
      return { ...prev, [field]: updated };
    });
  };

  const handleUpdate = async () => {
    if (!doctor?.id) {
      alert("Doctor ID not found. Cannot update.");
      return;
    }

    try {
      await fetch(`http://localhost:4000/doctors/${doctor.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      alert('✅ Doctor details updated successfully!');
    } catch (err) {
      console.error('Update failed:', err);
      alert('❌ Failed to update doctor details.');
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
        <p>Loading doctor profile...</p>
      </div>
    );
  }

  return (
  <div style={{ display: 'flex', minHeight: '100vh' }}>
    {/* Sidebar on the left */}
    <div style={{ width: '250px', backgroundColor: '#f8f9fa' }}>
      <DoctorSidebar />
    </div>

    {/* Main content on the right */}
    <div style={{ flex: 1, padding: '30px', display: 'flex', justifyContent: 'center' }}>
      <Card style={{ padding: '20px', width: '100%', maxWidth: '800px' }}>
        <h3 style={{ textAlign: 'center', marginBottom: 20, color: '#1976d2' }}>Doctor Profile</h3>
        <Form>
          {['name', 'email', 'phone', 'address', 'state', 'city', 'pincode', 'speciality', 'qualification', 'yearsOfExp'].map(field => (
            <Form.Group key={field} className="mb-3">
              <Form.Label>{field.charAt(0).toUpperCase() + field.slice(1)}</Form.Label>
              <Form.Control
                name={field}
                value={formData[field]}
                onChange={handleChange}
              />
            </Form.Group>
          ))}

          <Form.Group className="mb-3">
            <Form.Label>Available Days</Form.Label>
            <div className="d-flex flex-wrap">
              {allDays.map(day => (
                <Form.Check
                  key={day}
                  type="checkbox"
                  label={day}
                  checked={Array.isArray(formData.availableDays) && formData.availableDays.includes(day)}
                  onChange={() => handleCheckboxChange('availableDays', day)}
                  className="me-3"
                />
              ))}
            </div>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Available Slots</Form.Label>
            <div className="d-flex flex-wrap">
              {allSlots.map(slot => (
                <Form.Check
                  key={slot}
                  type="checkbox"
                  label={slot}
                  checked={Array.isArray(formData.availableSlots) && formData.availableSlots.includes(slot)}
                  onChange={() => handleCheckboxChange('availableSlots', slot)}
                  className="me-3"
                />
              ))}
            </div>
          </Form.Group>

          <div className="text-center mt-4">
            <Button variant="primary" onClick={handleUpdate}>Update Details</Button>
          </div>
        </Form>
      </Card>
    </div>
  </div>
);
}

export default DoctorProfile;