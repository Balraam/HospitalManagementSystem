import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import "bootstrap/dist/css/bootstrap.min.css";
import TopNavbar from './components/topnavbar';
import Footer from './components/footer';
import Login from './components/Login';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import ProtectedRoute from './components/ProtectedRoute';
import DoctorDashboard from './pages/DoctorDashboard';
import PatientDashboard from './pages/patientdashboard';
import BookAppointment from './components/appointmentbooking';
import AppointmentList from './components/patientappointmentlist';
import Notifications from './components/notification';
import PatientDetailsPage from './components/PatientDetailsPage';
import HospitalOverview from "./components/abouthospital";
import DashboardOverview from "./components/moredetails";
import Patients from './components/Patients';
import './App.css'; // Add layout styles here
import Settings from './components/Settings';
import ChangePassword from './components/adminDashboard/ChangePassword';
import AddEditDoctorForm from './components/adminDoctorMgmt/AddEditDoctorForm';
import DoctorList from './components/adminDoctorMgmt/DoctorList';
import AdminAppointmentList from './components/adminAppointmentMgmt/AppointmentList';
import PaitentList from './components/adminPatientMgmt/PaitentList';
import AddEditPaitentForm from './components/adminPatientMgmt/AddEditPaitentForm';
import AdminProfileView from './components/adminDashboard/AdminProfileView';
import AdminDashboard from './components/adminDashboard/AdminDashboard';
import PatientProfile from './components/PatientProfile';
import PatientChangePassword from './components/PatientChangePassword';
import DoctorProfile from './components/DoctorProfile';
import DoctorChangePassword from './components/DoctorChangePassword';

function App() {
  return (
    <div className='App'>
    <AuthProvider>
      <Router>
          <TopNavbar />
         <main>
            <Routes>
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/book" element={<BookAppointment />} />
              <Route path="/appointments" element={<AppointmentList />} />
              <Route path="/dashboard" element={<PatientDashboard />} />
              <Route path="/patient/:email" element={<PatientDetailsPage />} />
              <Route path="/about" element={<HospitalOverview />} />
              <Route path="/details" element={<DashboardOverview />} />
              <Route path="/patients" element={<Patients />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/admin/change-password" element={<ChangePassword />} />
              <Route path="/add-doctor" element={<AddEditDoctorForm />} />
            <Route path="/edit-doctor/:id" element={<AddEditDoctorForm />} />
            <Route path="/doctor-list" element={<DoctorList />} />
            <Route path="/appointment-list" element={<AdminAppointmentList />} />
            <Route path="/add-paitent" element={<AddEditPaitentForm />} />
            <Route path="/edit-paitent/:id" element={<AddEditPaitentForm />} />
            <Route path="/paitent-list" element={<PaitentList />} />
             <Route path="/patientprofile" element={<PatientProfile />} />
              <Route path="/patientchangepassword" element={<PatientChangePassword />} />
              <Route path="/adminprofile" element={<AdminProfileView />} />
               <Route path="/doctorprofile" element={<DoctorProfile />} />
               <Route path="/doctorchangepassword" element={<DoctorChangePassword />} />
              <Route path="/admin-dashboard" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/doctor" element={
                <ProtectedRoute allowedRoles={['doctor']}>
                  <DoctorDashboard />
                </ProtectedRoute>
              } />
              <Route path="/patient" element={
                <ProtectedRoute allowedRoles={['patient']}>
                  <PatientDashboard />
                </ProtectedRoute>
              } />
            </Routes>
           </main>
        <Footer />
      </Router>
    </AuthProvider>
    </div>
  );
}

export default App;
