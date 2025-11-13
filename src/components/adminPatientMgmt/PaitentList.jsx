import React, { useEffect, useState } from "react";
import "../../assets/PaitentList.css";

import Sidebar from "../../pages/adminCommon/Sidebar";
import AddEditPaitentForm from "./AddEditPaitentForm";
import { API_BASE } from "../../services/apiConfig";

const PaitentList = () => {
  const [patients, setPatients] = useState([]);
  const [editingPatient, setEditingPatient] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchPatients = async () => {
    try {
      const response = await fetch(`${API_BASE}/patients`);
      const data = await response.json();
      setPatients(data);
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this patient?")) {
      try {
        await fetch(`${API_BASE}/patients/${id}`, { method: "DELETE" });
        setPatients(patients.filter((p) => p.id !== id));
      } catch (error) {
        console.error("Error deleting patient:", error);
      }
    }
  };

  const handleEdit = (patient) => {
    setEditingPatient(patient);
  };

  const handleAdd = () => {
    setEditingPatient({}); // empty object means new patient
  };

  const handleSave = () => {
    setEditingPatient(null);
    fetchPatients();
  };

  const filteredPatients = patients.filter(
    (patient) =>
      patient.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar on the left */}
      <div style={{ width: "250px", backgroundColor: "#f8f9fa" }}>
        <Sidebar />
      </div>

      {/* Main content beside sidebar */}
      <div style={{ flex: 1, padding: "30px", display: "flex", justifyContent: "center" }}>
        <div style={{ width: "100%", maxWidth: "1000px" }}>
          {editingPatient ? (
            <AddEditPaitentForm
              patient={editingPatient}
              onSave={handleSave}
              onCancel={() => setEditingPatient(null)}
            />
          ) : (
            <div className="patient-list-container">
              <div className="patient-list-header">
                <h2 className="patient-list-title">Manage Patients</h2>
                <button className="add-btn" onClick={handleAdd}>
                  + Add Patient
                </button>
              </div>

              <div className="search-box">
                <input
                  type="text"
                  placeholder="Search by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <table className="patient-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPatients.length > 0 ? (
                    filteredPatients.map((patient) => (
                      <tr key={patient.id}>
                        <td>{patient.name}</td>
                        <td>{patient.email}</td>
                        <td>{patient.phone}</td>
                        <td>
                          <div className="patient-actions">
                            <button className="edit-btn" onClick={() => handleEdit(patient)}>
                              Edit
                            </button>
                            <button className="delete-btn" onClick={() => handleDelete(patient.id)}>
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4">No Patients found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaitentList;
// import React, { useEffect, useState } from "react";
// import "../../assets/PaitentList.css";

// import Sidebar from "../../pages/adminCommon/Sidebar";

// import AddEditPaitentForm from "./AddEditPaitentForm";
// import { API_BASE } from "../../services/apiConfig";

// const PaitentList = () => {
//   const [patients, setPatients] = useState([]);
//   const [editingPatient, setEditingPatient] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");

//   const fetchPatients = async () => {
//     try {
//       const response = await fetch(`${API_BASE}/patients`);
//       const data = await response.json();
//       setPatients(data);
//     } catch (error) {
//       console.error("Error fetching patients:", error);
//     }
//   };

//   useEffect(() => {
//     fetchPatients();
//   }, []);

//   const handleDelete = async (id) => {
//     if (window.confirm("Are you sure you want to delete this patient?")) {
//       try {
//         await fetch(`${API_BASE}/patients/${id}`, { method: "DELETE" });
//         setPatients(patients.filter((p) => p.id !== id));
//       } catch (error) {
//         console.error("Error deleting patient:", error);
//       }
//     }
//   };

//   const handleEdit = (patient) => {
//     setEditingPatient(patient);
//   };

//   const handleAdd = () => {
//     setEditingPatient({}); // empty object means new patient
//   };

//   const handleSave = () => {
//     setEditingPatient(null);
//     fetchPatients();
//   };

//   // Filter patients based on search term
//   const filteredPatients = patients.filter(
//     (patient) =>
//       patient.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       patient.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       patient.phone?.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="layout">
//       {/* <Header /> */}
//       <Sidebar />

//       <div className="dashboard-body">
//         <div className="content">
//           {editingPatient ? (
//             <AddEditPaitentForm
//               patient={editingPatient}
//               onSave={handleSave}
//               onCancel={() => setEditingPatient(null)}
//             />
//           ) : (
//             <div className="patient-list-container">
//               {/* Header row */}
//               <div className="patient-list-header">
//                 <h2 className="patient-list-title">Manage Patients</h2>
//                 <button className="add-btn" onClick={handleAdd}>
//                   + Add Patient
//                 </button>
//               </div>

//               {/* Search box */}
//               <div className="search-box">
//                 <input
//                   type="text"
//                   placeholder="Search by name, email, or phone..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//               </div>

//               {/* Table */}
//               <table className="patient-table">
//                 <thead>
//                   <tr>
//                     <th>Name</th>
//                     <th>Email</th>
//                     <th>Phone</th>
//                     <th>Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredPatients.length > 0 ? (
//                     filteredPatients.map((patient) => (
//                       <tr key={patient.id}>
//                         <td>{patient.fullName}</td>
//                         <td>{patient.email}</td>
//                         <td>{patient.phone}</td>
//                         <td>
//                           <div className="patient-actions">
//                             <button
//                               className="edit-btn"
//                               onClick={() => handleEdit(patient)}
//                             >
//                               Edit
//                             </button>
//                             <button
//                               className="delete-btn"
//                               onClick={() => handleDelete(patient.id)}
//                             >
//                               Delete
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan="4">No Patients found</td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* <Footer /> */}
//     </div>
//   );
// };

// export default PaitentList;