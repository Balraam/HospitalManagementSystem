import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../../pages/adminCommon/Sidebar';
import '../../assets/AddDoctorForm.css';
import {
    addDoctor,
    updateDoctor,
    getDoctorById,
    getDoctorsSpeciality,
    checkEmailExists
} from "../../services/doctorService";

function AddEditDoctorForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = Boolean(id);


    const initialDoc = {
        name: '',
        email: '',
        phone: '',
        password: 'Default@123',
        profilePic: '',
        address: '',
        state: '',
        city: '',
        pincode: '',
        speciality: '',
        qualification: '',
        yearsOfExp: '',
        availablityDay: '',
        availablityTime: '',
        resetToken: null
    };
 

    const [doctor, setDoctor] = useState(initialDoc);
    const [specialties, setSpeciality] = useState([]);
    const [availDaySelectedOptions, setAvailDaySelectedOptions] = useState([]);
    const [availTimeSelectedOptions, setAvailTimeSelectedOptions] = useState([]);
    const [errors, setErrors] = useState({});

    const availableDay = ['Mon', 'Tue', 'Wed', 'Thrus', 'Fri', 'Sat'];
    const availableTime = ['Morning(10AM-2PM)', 'Evening(5PM-9PM)'];

    // Load specialties
    useEffect(() => {
        getDoctorsSpeciality()
            .then(setSpeciality)
            .catch((err) => console.error("Error fetching specialties:", err));
    }, []);


    useEffect(() => {
        if (isEditMode) {
            getDoctorById(id)
                .then((data) => {
                    setDoctor(data);
                    setAvailDaySelectedOptions(data.availablityDay || []);
                    setAvailTimeSelectedOptions(data.availablityTime || []);
                })
                .catch((err) => console.error("Error fetching doctor:", err));
        } else {
            // Reset to blank when adding
            setDoctor(initialDoc);
            setAvailDaySelectedOptions([]);
            setAvailTimeSelectedOptions([]);
        }
    }, [id, isEditMode]);


    const validateForm = async () => {
        const newErrors = {};
        if (!doctor.name.trim()) newErrors.name = 'Name is required';
        if (!doctor.speciality) newErrors.speciality = 'Speciality is required';

        if (!doctor.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(doctor.email)) {
            newErrors.email = 'Email is invalid';
        } else if (!isEditMode) {
            try {
                const exists = await checkEmailExists(doctor.email);
                if (exists) {
                    newErrors.email = "Email already exists";
                }
            } catch {
                newErrors.email = "Could not verify email uniqueness";
            }
        }

        if (!doctor.phone) {
            newErrors.phone = 'Phone number is required';
        } else if (!/^\d{10}$/.test(doctor.phone)) {
            newErrors.phone = 'Phone number must be 10 digits';
        }

        if (!doctor.address) newErrors.address = 'Address is required';
        if (!doctor.state.trim()) newErrors.state = 'State is required';
        if (!doctor.city.trim()) newErrors.city = 'City is required';

        if (!doctor.pincode.trim()) {
            newErrors.pincode = 'Pincode is required';
        } else if (!/^\d{6}$/.test(doctor.pincode)) {
            newErrors.pincode = 'Pincode must be exactly 6 digits';
        }

        if (!doctor.qualification.trim()) newErrors.qualification = 'Qualification is required';
        if (!doctor.yearsOfExp.trim()) {
            newErrors.yearsOfExp = 'Years of Experience is required';
        } else if (!/^\d+$/.test(doctor.yearsOfExp)) {
            newErrors.yearsOfExp = 'Years of experience must be numeric';
        }

        if (availDaySelectedOptions.length === 0) newErrors.availableDay = 'Please select at least one available day';
        if (availTimeSelectedOptions.length === 0) newErrors.availableTime = 'Please select at least one time Slot';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === "checkbox") {
            if (name === "availablityDay") {
                setAvailDaySelectedOptions((prev) =>
                    checked ? [...prev, value] : prev.filter((d) => d !== value)
                );
                return;
            }
            if (name === "availablityTime") {
                setAvailTimeSelectedOptions((prev) =>
                    checked ? [...prev, value] : prev.filter((t) => t !== value)
                );
                return;
            }
        }
        setDoctor({ ...doctor, [name]: value });
        if (errors[name]) setErrors({ ...errors, [name]: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const isValid = await validateForm();
        if (!isValid) return;

        try {
            let doctorPayload = {
                ...doctor,
                availablityDay: availDaySelectedOptions,
                availablityTime: availTimeSelectedOptions,
            };

            if (isEditMode) {
                // remove password key when editing
                const { password, ...rest } = doctorPayload;
                doctorPayload = rest;
                //console.log(doctorPayload);
                await updateDoctor(id, doctorPayload);
                alert('Doctor updated!');
            } else {
                await addDoctor(doctorPayload);
                alert('Doctor added!');
            }

            navigate('/doctor-list'); // redirect after save
        } catch (error) {
            alert('Failed to save doctor');
            console.error(error);
        }
    };

    return (
  <div className="layout" style={{ display: 'flex', minHeight: '100vh' }}>
    {/* Sidebar on the left */}
    <div style={{ width: '250px', backgroundColor: '#f8f9fa' }}>
      <Sidebar />
    </div>

    {/* Form content beside sidebar */}
    <div style={{ flex: 1, padding: '30px', display: 'flex', justifyContent: 'center' }}>
      <div className="form-container" style={{ width: '100%', maxWidth: '800px' }}>
        <form onSubmit={handleSubmit}>
          <h2 style={{ marginBottom: '20px' }}>{isEditMode ? 'Edit Doctor' : 'Add Doctor'}</h2>

          <input
            name="name"
            className="form-feilds"
            placeholder="Name"
            value={doctor.name}
            onChange={handleChange}
          />
          {errors.name && <span className="error">{errors.name}</span>}

          <select
            name="speciality"
            className="form-feilds"
            value={doctor.speciality}
            onChange={handleChange}
          >
            <option value="">-- Select Speciality --</option>
            {specialties.map((item) => (
              <option key={item.id} value={item.speciality}>{item.speciality}</option>
            ))}
          </select>
          {errors.speciality && <span className="error">{errors.speciality}</span>}

          <input
            name="email"
            type="email"
            className="form-feilds"
            placeholder="Email"
            value={doctor.email}
            onChange={handleChange}
            disabled={isEditMode}
          />
          {errors.email && <span className="error">{errors.email}</span>}

          <input
            name="phone"
            placeholder="Phone"
            className="form-feilds"
            value={doctor.phone}
            onChange={handleChange}
          />
          {errors.phone && <span className="error">{errors.phone}</span>}

          <textarea
            name="address"
            placeholder="Address"
            className="form-feilds"
            value={doctor.address}
            onChange={handleChange}
          />
          {errors.address && <span className="error">{errors.address}</span>}

          <input
            name="state"
            placeholder="State"
            className="form-feilds"
            value={doctor.state}
            onChange={handleChange}
          />
          {errors.state && <span className="error">{errors.state}</span>}

          <input
            name="city"
            placeholder="City"
            className="form-feilds"
            value={doctor.city}
            onChange={handleChange}
          />
          {errors.city && <span className="error">{errors.city}</span>}

          <input
            name="pincode"
            placeholder="Pincode"
            className="form-feilds"
            value={doctor.pincode}
            onChange={handleChange}
          />
          {errors.pincode && <span className="error">{errors.pincode}</span>}

          <input
            name="qualification"
            placeholder="Qualification"
            className="form-feilds"
            value={doctor.qualification}
            onChange={handleChange}
          />
          {errors.qualification && <span className="error">{errors.qualification}</span>}

          <input
            name="yearsOfExp"
            placeholder="Years of Experience"
            className="form-feilds"
            value={doctor.yearsOfExp}
            onChange={handleChange}
          />
          {errors.yearsOfExp && <span className="error">{errors.yearsOfExp}</span>}

          <div className="checkbox-group">
            <span className="label-title">Available Days:</span>
            <div className="checkbox-options">
              {availableDay.map((day) => (
                <label key={day} style={{ marginRight: '15px' }}>
                  <input
                    name="availablityDay"
                    type="checkbox"
                    value={day}
                    checked={availDaySelectedOptions.includes(day)}
                    onChange={handleChange}
                  />
                  {day}
                </label>
              ))}
            </div>
          </div>
          {errors.availableDay && <span className="error">{errors.availableDay}</span>}

          <div className="checkbox-group">
            <span className="label-title">Available Time:</span>
            <div className="checkbox-options">
              {availableTime.map((time) => (
                <label key={time} style={{ marginRight: '15px' }}>
                  <input
                    name="availablityTime"
                    type="checkbox"
                    value={time}
                    checked={availTimeSelectedOptions.includes(time)}
                    onChange={handleChange}
                  />
                  {time}
                </label>
              ))}
            </div>
          </div>
          {errors.availableTime && <span className="error">{errors.availableTime}</span>}

          <div className="form-actions" style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
            <button type="submit" className="btn btn-primary">
              {isEditMode ? 'Update Doctor' : 'Add New Doctor'}
            </button>
            <button
              className="cancel-btn btn btn-secondary"
              type="button"
              onClick={() => navigate('/doctor-list')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
);
}
export default AddEditDoctorForm;