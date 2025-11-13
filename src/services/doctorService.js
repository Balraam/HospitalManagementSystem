import axios from "axios";
import { API_BASE } from "./apiConfig";

// Get all doctors
export const getDoctors = async () => {
  const res = await axios.get(`${API_BASE}/doctors`);
  return res.data;
};

// Get doctor by ID
export const getDoctorById = async (id) => {
  const res = await axios.get(`${API_BASE}/doctors/${id}`);
  return res.data;
};

// Add a new doctor
export const addDoctor = async (doctor) => {
  const res = await axios.post(`${API_BASE}/doctors`, doctor);
  return res.data;
};

// Update doctor
export const updateDoctor = async (id, doctor) => {
  const res = await axios.put(`${API_BASE}/doctors/${id}`, doctor);
  return res.data;
};

// Delete doctor
export const deleteDoctor = async (id) => {
  await axios.delete(`${API_BASE}/doctors/${id}`);
};

// Get all doctors speciality
export const getDoctorsSpeciality = async () => {
  const res = await axios.get(`${API_BASE}/doctor-speciality`);
  return res.data;
};

//check the email unique from patients and doctor array
export const checkEmailExists = async (email) => {
  try {
    const [res1, res2] = await Promise.all([
      axios.get(`${API_BASE}/doctors?email=${email}`),
      axios.get(`${API_BASE}/patients?email=${email}`)
    ]);
    
    const exists = (res1.data && res1.data.length > 0) || (res2.data && res2.data.length > 0);
    return exists;
  } catch (error) {
    console.error("Error checking email uniqueness:", error);
    throw error;
  }
};
