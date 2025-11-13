import React, { useEffect, useState } from 'react';
import Sidebar from '../../pages/adminCommon/Sidebar';
import { getDoctors, deleteDoctor, getDoctorsSpeciality } from '../../services/doctorService';
import { useNavigate } from 'react-router-dom';
import '../../assets/DoctorList.css';

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [specialities, setSpecialities] = useState([]);
  const [selectedSpeciality, setSelectedSpeciality] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const data = await getDoctors();
        setDoctors(data);
        setFilteredDoctors(data);

        const specialityData = await getDoctorsSpeciality();
        setSpecialities(specialityData.map(s => s.speciality));
      } catch (error) {
        console.error(error);
      }
    };
    fetchDoctors();
  }, []);

  useEffect(() => {
    let filtered = doctors;

    if (searchName.trim() !== "") {
      filtered = filtered.filter(d =>
        d.name.toLowerCase().includes(searchName.toLowerCase())
      );
    }

    if (selectedSpeciality) {
      filtered = filtered.filter(d => d.speciality === selectedSpeciality);
    }

    setFilteredDoctors(filtered);
  }, [searchName, selectedSpeciality, doctors]);

  const handleEdit = (id) => {
    navigate(`/edit-doctor/${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this doctor?')) {
      try {
        await deleteDoctor(id);
        setDoctors(doctors.filter(doc => doc.id !== id));
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar on the left */}
      <div style={{ width: '250px', backgroundColor: '#f8f9fa' }}>
        <Sidebar />
      </div>

      {/* Doctor list content */}
      <div style={{ flex: 1, padding: '30px', display: 'flex', justifyContent: 'center' }}>
        <div style={{ maxWidth: '1000px', width: '100%' }}>
          <div className="doctor-list-container">
            <div className="doctor-list-header">
              <h2 className="doctor-list-title">Manage Doctors</h2>
              <button className="add-btn" onClick={() => navigate('/add-doctor')}>
                + Add Doctor
              </button>
            </div>

            <div className="filters">
              <div className="search-box">
                <input
                  type="text"
                  placeholder="Search by doctor name..."
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                />
              </div>

              <div className="dropdown-box">
                <select
                  value={selectedSpeciality}
                  onChange={(e) => setSelectedSpeciality(e.target.value)}
                >
                  <option value="">All Specialities</option>
                  {specialities.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <table className="doctor-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Speciality</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDoctors.length > 0 ? (
                  filteredDoctors.map((doc) => (
                    <tr key={doc.id}>
                      <td>{doc.name}</td>
                      <td>{doc.speciality}</td>
                      <td>
                        <div className="doctor-actions">
                          <button className="edit-btn" onClick={() => handleEdit(doc.id)}>
                            Edit
                          </button>
                          <button className="delete-btn" onClick={() => handleDelete(doc.id)}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3">No doctors found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorList;
