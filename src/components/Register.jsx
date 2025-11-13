import React, { useState, useEffect } from "react";
import "../assets/RegistrationForm.css";
import { addDoctor, checkEmailExists, getDoctorsSpeciality } from "../services/doctorService";
import { addPatient, checkPatientEmailExists } from "../services/patientService";
import { useNavigate } from "react-router-dom";
  
 
const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "Rare"];
const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const timeSlots = ["Morning(9AM-2PM)", "Evening(5PM-9PM)"];
 
const RegistrationForm = () => {
  const [userType, setUserType] = useState("doctor");
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [specialities, setSpecialities] = useState([]);
  const navigate = useNavigate();
  // ✅ Fetch doctor specialities from db.json
 useEffect(() => {
   const fetchSpecialities = async () => {
     try {
       const data = await getDoctorsSpeciality();
       setSpecialities(data);
     } catch (err) {
       console.error("Failed to fetch specialities", err);
     }
   };
   fetchSpecialities();
 }, []);
 
  const handleDaysChange = (day, checked) => {
    let updated = formData.availablityDay ? [...formData.availablityDay] : [];
    if (checked) updated.push(day);
    else updated = updated.filter(d => d !== day);
    setFormData({ ...formData, availablityDay: updated });
  };
 
  const handleTimeChange = (slot, checked) => {
    let updated = formData.availablityTime ? [...formData.availablityTime] : [];
    if (checked) updated.push(slot);
    else updated = updated.filter(s => s !== slot);
    setFormData({ ...formData, availablityTime: updated });
  };
 
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (["phone", "emergencyContact"].includes(name)) {
      const numericValue = value.replace(/\D/g, "");
      if (numericValue.length <= 10) setFormData({ ...formData, [name]: numericValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
 
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };
 
  const validate = async () => {
    const newErrors = {};
    const emailRegex = /^[^@]+@[^@]+\.[^@]+$/;
 
    const requiredFields =
      userType === "doctor"
        ? ["name", "email", "password", "phone", "speciality", "qualification", "experience", "availablityDay", "availablityTime", "state", "city", "pincode", "address"]
        : ["name", "dob", "gender", "password", "phone", "email", "address", "bloodGroup", "emergencyContact", "state", "city", "pincode"];
 
    requiredFields.forEach(field => {
      if (!formData[field] || (Array.isArray(formData[field]) && formData[field].length === 0)) {
        newErrors[field] = "This field is required";
      }
    });
 
    // Email format
    if (formData.email && !emailRegex.test(formData.email)) newErrors.email = "Invalid email format";
 
    // Phone validation
    if ((formData.phone && formData.phone.length !== 10)) newErrors.phone = "Phone must be 10 digits";
    if ((formData.emergencyContact && formData.emergencyContact.length !== 10)) newErrors.emergencyContact = "Emergency must be 10 digits";
 
    // Password validation
if (!formData.password) {
  newErrors.password = "Password is required";
} else {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
  if (!passwordRegex.test(formData.password)) {
    newErrors.password = "Password must be 8 chars, 1 uppercase, 1 lowercase, 1 digit, 1 symbol";
  }
}
 
    // Unique email
    if (formData.email) {
      const exists = userType === "doctor"
        ? await checkEmailExists(formData.email)
        : await checkPatientEmailExists(formData.email);
      if (exists) newErrors.email = "Email already exists";
    }
 
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = await validate();
    if (!isValid) {
      alert("Please fill all required fields.");
      return;
    }
 
    try {
      if (userType === "doctor") await addDoctor(formData);
      else await addPatient(formData);
 
      setMessage(`${userType === "doctor" ? "Doctor" : "Patient"} registered successfully!`);
      setFormData({});
      setErrors({});
      window.alert("✅ You have successfully registered! You can login now"); // ✅ Show alert
      navigate("/login"); // Redirect to home or login page
    } catch (err) {
      console.error(err);
      setMessage("Error registering, try again!");
    }
  };
 
  return (
    <div className="registration-form" >
      <h2 style={{ textAlign: 'center', marginBottom: 20, color: '#1976d2' }}>Registration</h2>
 
      <label>User Type</label>
      <select value={userType} onChange={(e) => setUserType(e.target.value)}>
        <option value="doctor">Doctor</option>
        <option value="patient">Patient</option>
      </select>
 
      <form onSubmit={handleSubmit}>
  <label>Full Name <span className="required-asterisk">*</span></label>
  <input name="name" type="text" onChange={handleChange} value={formData.name || ""} required aria-required="true" />
        {errors.name && <span className="error">{errors.name}</span>}
 
  <label>Email <span className="required-asterisk">*</span></label>
  <input name="email" type="email" onChange={handleChange} value={formData.email || ""} required aria-required="true" />
        {errors.email && <span className="error">{errors.email}</span>}
 
 
       <label htmlFor="password">
  Password <span className="required-asterisk">*</span>
</label>
<div style={{ position: 'relative', width: '100%' }}>
  <input
    name="password"
    id="password"
    type="password"
    onChange={handleChange}
    value={formData.password || ""}
    style={{ width: '100%', boxSizing: 'border-box', paddingRight: 32 }}
    required
    aria-required="true"
  />
  <span
    onClick={() => setShowPassword((prev) => !prev)}
    style={{
      position: 'absolute',
      right: 8,
      cursor: 'pointer',
      userSelect: 'none',
      top: '50%',
      transform: 'translateY(-50%)'
    }}
    title={showPassword ? "Hide password" : "Show password"}
  >
 
          </span>
        </div>
        <div style={{ fontWeight: 'normal', fontSize: '0.85em', marginBottom: 4, color: '#555', maxWidth: 350 }}>
          (min 8 chars, 1 uppercase, 1 lowercase, 1 digit, 1 symbol)
        </div>
        {errors.password && <span className="error">{errors.password}</span>}
 
  <label>Phone <span className="required-asterisk">*</span></label>
  <input name="phone" type="text" onChange={handleChange} value={formData.phone || ""} required aria-required="true" />
        {errors.phone && <span className="error">{errors.phone}</span>}
 
  <label>Address <span className="required-asterisk">*</span></label>
  <input name="address" type="text" onChange={handleChange} value={formData.address || ""} required aria-required="true" />
        {errors.address && <span className="error">{errors.address}</span>}
 
  <label>State <span className="required-asterisk">*</span></label>
  <input name="state" type="text" onChange={handleChange} value={formData.state || ""} required aria-required="true" />
        {errors.state && <span className="error">{errors.state}</span>}
 
  <label>City <span className="required-asterisk">*</span></label>
  <input name="city" type="text" onChange={handleChange} value={formData.city || ""} required aria-required="true" />
        {errors.city && <span className="error">{errors.city}</span>}
 
  <label>Pincode <span className="required-asterisk">*</span></label>
  <input name="pincode" type="text" onChange={handleChange} value={formData.pincode || ""} maxLength={6} required aria-required="true" />
        {errors.pincode && <span className="error">{errors.pincode}</span>}
 
        {userType === "patient" && (
          <>
            <label>Date of Birth <span className="required-asterisk">*</span></label>
            <input name="dob" type="date" onChange={handleChange} value={formData.dob || ""} required aria-required="true" />
            {errors.dob && <span className="error">{errors.dob}</span>}
 
            <label>Gender <span className="required-asterisk">*</span></label>
            <div className="radio-group">
              {["Male", "Female", "Other"].map((g, idx) => (
                <label key={g}>
                  <input type="radio" name="gender" value={g} checked={formData.gender === g} onChange={handleChange} required={idx === 0} aria-required={idx === 0 ? "true" : undefined} /> {g}
                </label>
              ))}
            </div>
            {errors.gender && <span className="error">{errors.gender}</span>}
 
            <label>Blood Group <span className="required-asterisk">*</span></label>
            <select name="bloodGroup" onChange={handleChange} value={formData.bloodGroup || ""} required aria-required="true">
              <option value="">Select</option>
              {bloodGroups.map(bg => <option key={bg} value={bg}>{bg}</option>)}
            </select>
            {errors.bloodGroup && <span className="error">{errors.bloodGroup}</span>}
 
            <label>Emergency Contact <span className="required-asterisk">*</span></label>
            <input name="emergencyContact" type="text" onChange={handleChange} value={formData.emergencyContact || ""} required aria-required="true" />
            {errors.emergencyContact && <span className="error">{errors.emergencyContact}</span>}
 
            <label>Known Allergies</label>
            <input name="allergies" type="text" onChange={handleChange} value={formData.allergies || ""} />
 
            <label>Existing Medical Conditions</label>
            <input name="conditions" type="text" onChange={handleChange} value={formData.conditions || ""} />
 
            <label>Current Medications</label>
            <input name="medications" type="text" onChange={handleChange} value={formData.medications || ""} />
          </>
        )}
 
        {userType === "doctor" && (
          <>
           
           <label>Speciality <span className="required-asterisk">*</span></label>
           <select
             name="speciality"
             onChange={handleChange}
             value={formData.speciality || ""}
           >
             <option value="">Select Speciality</option>
             {specialities.map(s => (
               <option key={s.id} value={s.speciality}>{s.speciality}</option>
             ))}
           </select>
           {errors.speciality && <span className="error">{errors.speciality}</span>}
 
            <label>Qualification <span className="required-asterisk">*</span></label>
            <input name="qualification" type="text" onChange={handleChange} value={formData.qualification || ""} required aria-required="true" />
            {errors.qualification && <span className="error">{errors.qualification}</span>}
 
            <label>Years of Experience <span className="required-asterisk">*</span></label>
            <input name="experience" type="number" onChange={handleChange} value={formData.experience || ""} required aria-required="true" />
            {errors.experience && <span className="error">{errors.experience}</span>}
 
            <label>Available Days <span className="required-asterisk">*</span></label>
            <div className="checkbox-group single-line">
              {daysOfWeek.map(day => (
                <label key={day}>
                  <input type="checkbox" value={day} checked={formData.availablityDay?.includes(day) || false} onChange={(e) => handleDaysChange(day, e.target.checked)} />
                  {day}
                </label>
              ))}
            </div>
            {errors.availablityDay && <span className="error">{errors.availablityDay}</span>}
 
            <label>Available Time Slots <span className="required-asterisk">*</span></label>
            <div className="checkbox-group single-line">
              {timeSlots.map(slot => (
                <label key={slot}>
                  <input type="checkbox" value={slot} checked={formData.availablityTime?.includes(slot) || false} onChange={(e) => handleTimeChange(slot, e.target.checked)} />
                  {slot}
                </label>
              ))}
            </div>
            {errors.availablityTime && <span className="error">{errors.availablityTime}</span>}
             <label>Profile Picture </label>
            <input name="profilePic" type="file" />
          </>
        )}
 
 
        <button type="submit">{userType === "doctor" ? "Register Doctor" : "Register Patient"}</button>
      </form>
      {message && <p style={{ color: "green" }}>{message}</p>}
    </div>
  );
};
 
export default RegistrationForm;
 
 