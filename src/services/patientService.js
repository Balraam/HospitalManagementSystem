// src/services/patientService.js
import axios from "axios";
import { API_BASE } from "./apiConfig";
 
// Get all patients
export const getPatients = async () => {
  const res = await axios.get(`${API_BASE}/patients`);
  return res.data;
};
 
// Get patient by ID
export const getPatientById = async (id) => {
  const res = await axios.get(`${API_BASE}/patients/${id}`);
  return res.data;
};
 
// Add patient
export const addPatient = async (patient) => {
  const res = await axios.post(`${API_BASE}/patients`, patient);
  return res.data;
};
 
// Update patient
export const updatePatient = async (id, patient) => {
  const res = await axios.put(`${API_BASE}/patients/${id}`, patient);
  return res.data;
};
 
// Delete patient
export const deletePatient = async (id) => {
  await axios.delete(`${API_BASE}/patients/${id}`);
};
 
// Check if email already exists
export const checkPatientEmailExists = async (email) => {
  const res = await axios.get(`${API_BASE}/patients?email=${email}`);
  return res.data.length > 0;
};
 
 