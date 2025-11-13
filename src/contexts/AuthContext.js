import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE } from '../services/apiConfig';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [admins, setAdmins] = useState([]);

  // Load session from localStorage
  useEffect(() => {
    const session = JSON.parse(localStorage.getItem('session') || 'null');
    if (session) setUser(session);
  }, []);

  //  Fetch admins from API
  useEffect(() => {
    async function fetchAdmins() {
      try {
        const res = await axios.get(`${API_BASE}/admins`);
        if (Array.isArray(res.data)) {
          setAdmins(res.data); 
        }
      } catch (err) {
        console.error('Failed to load admins:', err);
      }
    }
    fetchAdmins();
  }, []);

  async function login({ email, password, role }) {
    try {
      //  Admin login
      if (role === 'admin') {
        const admin = admins.find(a => a.email === email && a.password === password);
        if (admin) {
          const adminUser = {
            id: admin.id,
            name: admin.name,
            role: 'admin',
            email: admin.email
          };
          localStorage.setItem('session', JSON.stringify(adminUser));
          setUser(adminUser);
          return { ok: true, redirectTo: '/admin-dashboard' };
        }

        // Prevent login if email belongs to doctor or patient
        const [doctorRes, patientRes] = await Promise.all([
          axios.get(`${API_BASE}/doctors?email=${email}`),
          axios.get(`${API_BASE}/patients?email=${email}`)
        ]);

        if (doctorRes.data.length || patientRes.data.length) {
          return {
            ok: false,
            wrongRole: true,
            message: 'Wrong role selected. This email belongs to a doctor or patient.'
          };
        }

        return { ok: false, message: 'Invalid admin credentials' };
      }

      //  Doctor login
      if (role === 'doctor') {
        const res = await axios.get(`${API_BASE}/doctors?email=${email}`);
        const doctor = res.data[0];

        if (doctor && doctor.password === password) {
          const docUser = {
            id: doctor.id,
            name: doctor.name,
            role: 'doctor',
            email: doctor.email,
            qualification: doctor.qualification || '',
            profilePic: doctor.profilePic || ''
          };
          localStorage.setItem('session', JSON.stringify(docUser));
          setUser(docUser);
          return { ok: true, redirectTo: '/doctor' };
        }

        // Prevent login if email belongs to patient
        const patientRes = await axios.get(`${API_BASE}/patients?email=${email}`);
        if (patientRes.data[0]?.password === password) {
          return {
            ok: false,
            wrongRole: true,
            message: 'Wrong role selected. This email belongs to a patient.'
          };
        }

        return { ok: false, message: 'Invalid doctor credentials' };
      }

      // Patient login
      if (role === 'patient') {
        const res = await axios.get(`${API_BASE}/patients?email=${email}`);
        const patient = res.data[0];

        if (patient && patient.password === password) {
          const patUser = {
            id: patient.id,
            name: patient.name,
            role: 'patient',
            email: patient.email
          };
          localStorage.setItem('session', JSON.stringify(patUser));
          setUser(patUser);
          return { ok: true, redirectTo: '/patient' };
        }

        // Prevent login if email belongs to doctor
        const doctorRes = await axios.get(`${API_BASE}/doctors?email=${email}`);
        if (doctorRes.data[0]?.password === password) {
          return {
            ok: false,
            wrongRole: true,
            message: 'Wrong role selected. This email belongs to a doctor.'
          };
        }

        return { ok: false, message: 'Invalid patient credentials' };
      }

      return { ok: false, message: 'Unknown role selected' };
    } catch (err) {
      console.error('Login error:', err);
      return { ok: false, message: 'Server error. Please try again.' };
    }
  }

  function logout() {
    localStorage.removeItem('session');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

