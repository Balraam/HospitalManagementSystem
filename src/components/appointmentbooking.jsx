
import React, { useState, useEffect } from "react";
import { Form, Button, Card } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import Sidebar from "./dashboard";
import axios from "axios";

function BookAppointment() {
  const [patientName, setPatientName] = useState("");
  const [speciality, setSpeciality] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [reasonForBooking, setReasonForBooking] = useState("");
  const [appointmentDate, setAppointmentDate] = useState(null);
  const [slot, setSlot] = useState("");
  const [timeRange, setTimeRange] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [availableSlots, setAvailableSlots] = useState({ morning: [], evening: [] });
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [specialities, setSpecialities] = useState([]);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const session = JSON.parse(localStorage.getItem("session"));
    if (session?.name) {
      setPatientName(session.name);
    }
  }, []);

  useEffect(() => {
    axios.get("http://localhost:4000/doctors")
      .then(res => {
        setDoctors(res.data);
        const uniqueSpecialities = [...new Set(res.data.map(doc => doc.speciality))];
        setSpecialities(uniqueSpecialities);
      })
      .catch(err => console.error(err));

    axios.get("http://localhost:4000/appointmentlist")
      .then(res => setAppointments(res.data))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (speciality) {
      const filtered = doctors.filter(doc => doc.speciality === speciality);
      setFilteredDoctors(filtered);
      setDoctorName("");
      setAppointmentDate(null);
      setSlot("");
      setTimeRange("");
      setAvailableSlots({ morning: [], evening: [] });
    } else {
      setFilteredDoctors([]);
    }
  }, [speciality, doctors]);

  useEffect(() => {
    const doctor = doctors.find(d => d.name === doctorName);
    setSelectedDoctor(doctor || null);
  }, [doctorName, doctors]);

  useEffect(() => {
    if (!doctorName || !appointmentDate) return;
    const doctor = doctors.find(d => d.name === doctorName);
    if (!doctor) return;

    const weekday = appointmentDate.toLocaleDateString("en-US", { weekday: "long" });
    if (!doctor.availableDays.includes(weekday)) {
      setAvailableSlots({ morning: [], evening: [] });
      return;
    }

    const dateStr = `${appointmentDate.getFullYear()}-${String(appointmentDate.getMonth() + 1).padStart(2, "0")}-${String(appointmentDate.getDate()).padStart(2, "0")}`;
    const bookedSlots = appointments
      .filter(a => a.doctorName === doctorName && a.appointmentDate === dateStr)
      .map(a => a.timeRange);

    const filteredMorning = doctor.availableSlots.morning.filter(t => !bookedSlots.includes(t));
    const filteredEvening = doctor.availableSlots.evening.filter(t => !bookedSlots.includes(t));

    setAvailableSlots({ morning: filteredMorning, evening: filteredEvening });
    setSlot("");
    setTimeRange("");
  }, [doctorName, appointmentDate, appointments, doctors]);

  const isWeekdayAvailable = date => {
    if (!selectedDoctor) return false;
    const day = date.toLocaleDateString("en-US", { weekday: "long" });
    return selectedDoctor.availableDays.includes(day);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const newErrors = {};
    if (!speciality) newErrors.speciality = "Select a speciality";
    if (!doctorName) newErrors.doctorName = "Select a doctor";
    if (!reasonForBooking.trim()) newErrors.reason = "Reason for booking is required";
    if (!appointmentDate) newErrors.date = "Select a valid date";
    if (!slot) newErrors.slot = "Select a slot";
    if (!timeRange) newErrors.time = "Select a time";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const year = appointmentDate.getFullYear();
    const month = String(appointmentDate.getMonth() + 1).padStart(2, "0");
    const day = String(appointmentDate.getDate()).padStart(2, "0");
    const dateStr = `${year}-${month}-${day}`;

    const newAppointment = {
      patientName,
      speciality,
      doctorName,
      reasonForBooking,
      appointmentDate: dateStr,
      slot,
      timeRange,
      approvalStatus: "pending"
    };

    try {
      const res = await axios.post("http://localhost:4000/appointmentlist", newAppointment);
      if (res.status !== 201) throw new Error("Server error");

      // ✅ Send notifications to admin, doctor, and patient
      const roles = ['admin', 'doctor', 'patient'];
      for (const role of roles) {
        await axios.post("http://localhost:4000/notifications", {
          recipient: role,
          message: `New appointment booked by ${patientName} with ${doctorName} on ${dateStr} (${timeRange})`,
          timestamp: new Date().toISOString(),
          read: false
        });
      }

      alert("✅ Appointment booked successfully!");
      navigate("/notifications");
    } catch (err) {
      console.error(err);
      alert("Failed to book appointment.");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <div style={{ display: "flex", flex: 1 }}>
        <div style={{ width: "250px", backgroundColor: "#f8f9fa" }}>
          <Sidebar />
        </div>
        <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", padding: "20px" }}>
          <Card style={{ padding: "25px", minWidth: "500px", boxShadow: "0 0 10px rgba(0,0,0,0.1)", borderRadius: "10px" }}>
            <h2 style={{ textAlign: 'center', marginBottom: 20, color: '#1976d2' }}>Book Appointment</h2>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Patient Name</Form.Label>
                <Form.Control type="text" value={patientName} disabled />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Speciality</Form.Label>
                <Form.Select value={speciality} onChange={e => setSpeciality(e.target.value)}>
                  <option value="">Select Speciality</option>
                  {specialities.map(s => <option key={s} value={s}>{s}</option>)}
                </Form.Select>
                {errors.speciality && <div className="text-danger">{errors.speciality}</div>}
              </Form.Group>
              {filteredDoctors.length > 0 && (
                <Form.Group className="mb-3">
                  <Form.Label>Doctor</Form.Label>
                  <Form.Select value={doctorName} onChange={e => setDoctorName(e.target.value)}>
                    <option value="">Select Doctor</option>
                    {filteredDoctors.map(d => <option key={d.name} value={d.name}>{d.name}</option>)}
                  </Form.Select>
                  {errors.doctorName && <div className="text-danger">{errors.doctorName}</div>}
                </Form.Group>
              )}
              {doctorName && (
                <Form.Group className="mb-3">
                  <Form.Label>Appointment Date</Form.Label>
                  <DatePicker
                    selected={appointmentDate}
                    onChange={date => setAppointmentDate(date)}
                    filterDate={isWeekdayAvailable}
                    minDate={new Date()}
                    dateFormat="yyyy-MM-dd"
                    placeholderText="Select an available date"
                    className="form-control"
                  />
                  {errors.date && <div className="text-danger">{errors.date}</div>}
                </Form.Group>
              )}
              {appointmentDate && (
                <Form.Group className="mb-3">
                  <Form.Label>Slot</Form.Label>
                  <Form.Select value={slot} onChange={e => { setSlot(e.target.value); setTimeRange(""); }}>
                    <option value="">Select Slot</option>
                    {availableSlots.morning.length > 0 && <option value="morning">Morning</option>}
                    {availableSlots.evening.length > 0 && <option value="evening">Evening</option>}
                  </Form.Select>
                  {errors.slot && <div className="text-danger">{errors.slot}</div>}
                </Form.Group>
              )}
              {slot && (
                <Form.Group className="mb-3">
                  <Form.Label>Time</Form.Label>
                  <Form.Select value={timeRange} onChange={e => setTimeRange(e.target.value)}>
                    <option value="">Select Time</option>
                    {availableSlots[slot].map(t => <option key={t} value={t}>{t}</option>)}
                  </Form.Select>
                  {errors.time && <div className="text-danger">{errors.time}</div>}
                </Form.Group>
              )}
              <Form.Group className="mb-3">
                <Form.Label>Reason for Booking</Form.Label>
                <Form.Control as="textarea" rows={2} value={reasonForBooking} onChange={e => setReasonForBooking(e.target.value)} />
                {errors.reason && <div className="text-danger">{errors.reason}</div>}
              </Form.Group>
              <Button type="submit" variant="primary" className="w-100">Book Appointment</Button>
            </Form>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default BookAppointment;
