import React, { useEffect, useState } from 'react';
import Sidebar from '../../pages/adminCommon/Sidebar';// Make sure this is your sidebar component
import '../../assets/AdminProfile.css';

function AdminProfileView() {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const res = await fetch('http://localhost:4000/admins');
        const data = await res.json();
        if (data.length > 0) {
          setAdmin(data[0]);
        } else {
          alert("No admin found in database.");
        }
      } catch (error) {
        console.error("Error fetching admin:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdmin();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdmin((prev) => ({ ...prev, [name]: value }));
    setMessage("");
  };

  const handleSave = async () => {
    try {
      await fetch(`http://localhost:4000/admins/${admin.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(admin)
      });
      setMessage("✅ Profile has been updated!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    }
  };

  if (loading) return <p className="p-4">Loading profile...</p>;
  if (!admin) return <p className="p-4">Admin not found.</p>;

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <div style={{ width: "250px", backgroundColor: "#f8f9fa" }}>
        <Sidebar />
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: "30px" }}>
        <div className="container">
          <h2>Admin Profile</h2>

          {message && <div className="text-success mb-3">{message}</div>}

          <div className="row">
            {Object.entries(admin).map(([key, value]) => (
              key !== "id" && key !== "resetToken" && (
                <div className="col-md-6 mb-3" key={key}>
                  <label className="form-label" style={{ fontWeight: "bold", textAlign: "left", display: "block" }}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </label>
                  <input
                    type={key === "password" ? "password" : "text"}
                    className="form-control"
                    name={key}
                    value={value}
                    onChange={handleChange}
                  />
                </div>
              )
            ))}
          </div>

          <div className="text-center mt-3">
            <button className="btn btn-success" onClick={handleSave}>
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminProfileView;
// import React, { useEffect, useState } from 'react';
// import '../../assets/AdminProfile.css';
// import Sidebar from '../../pages/adminCommon/Sidebar';

// function AdminProfileView() {
//   const [admin, setAdmin] = useState(null);
//   const [isEditing, setIsEditing] = useState(false);
//   const [loading, setLoading] = useState(true);

//   // ✅ Fetch the only admin from db.json
//   useEffect(() => {
//     const fetchAdmin = async () => {
//       try {
//         const res = await fetch('http://localhost:4000/admins');
//         const data = await res.json();
//         if (data.length > 0) {
//           setAdmin(data[0]);
//         } else {
//           alert("No admin found in database.");
//         }
//       } catch (error) {
//         console.error("Error fetching admin:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAdmin();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setAdmin((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSave = async () => {
//     try {
//       await fetch(`http://localhost:4000/admins/${admin.id}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(admin)
//       });
//       alert("Profile updated successfully!");
//       setIsEditing(false);
//     } catch (error) {
//       console.error("Error updating profile:", error);
//       alert("Failed to update profile.");
//     }
//   };

//   if (loading) return <p className="p-4">Loading profile...</p>;
//   if (!admin) return <p className="p-4">Admin not found.</p>;

//   return (
//     <div>
//       <Sidebar />
    
//     <div className="container mt-4">
//       <h2>{admin.name}'s Profile</h2>

//       <div className="mb-3">
//         {!isEditing ? (
//           <button className="btn btn-primary" onClick={() => setIsEditing(true)}>Edit Profile</button>
//         ) : (
//           <>
//             <button className="btn btn-success me-2" onClick={handleSave}>Save Changes</button>
//             <button className="btn btn-secondary" onClick={() => setIsEditing(false)}>Cancel</button>
//           </>
//         )}
//       </div>

//       <div className="row">
//         {Object.entries(admin).map(([key, value]) => (
//           key !== "id" && key !== "resetToken" && (
//             <div className="col-md-6 mb-3" key={key}>
//               <label className="form-label" style={{ fontWeight: "bold", textAlign: "left", display: "block" }}>
//                 {key.charAt(0).toUpperCase() + key.slice(1)}
//               </label>
//               {isEditing ? (
//                 <input
//                   type={key === "password" ? "password" : "text"}
//                   className="form-control"
//                   name={key}
//                   value={value}
//                   onChange={handleChange}
//                 />
//               ) : (
//                 <p className="form-control view-mode">{value}</p>
//               )}
//             </div>
//           )
//         ))}
//       </div>
//     </div>
//     </div>
//   );
// }

// export default AdminProfileView;
// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { getAdminById, updateAdmin } from '../../services/adminprofileservice';
// import '../../assets/AdminProfile.css';
 
// function AdminProfileView() {
//   const { adminId } = useParams();
//   const [admin, setAdmin] = useState(null);
//   const [isEditing, setIsEditing] = useState(false);
//   const [loading, setLoading] = useState(true);
 
//   useEffect(() => {
//     const fetchAdmin = async () => {
//       try {
//         const data = await getAdminById(adminId);
//         setAdmin(data);
//       } catch (error) {
//         console.error("Error fetching admin:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
 
//     fetchAdmin();
//   }, [adminId]);
 
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setAdmin((prev) => ({ ...prev, [name]: value }));
//   };
 
//   const handleSave = async () => {
//     try {
//       await updateAdmin(adminId, admin);
//       alert("Profile updated successfully!");
//       setIsEditing(false);
//     } catch (error) {
//       console.error("Error updating profile:", error);
//       alert("Failed to update profile.");
//     }
//   };
 
//   if (loading) return <p className="p-4">Loading profile...</p>;
//   if (!admin) return <p className="p-4">Admin not found.</p>;
 
//   return (
//     <div className="container mt-4">
//       <h2>{admin.name}'s Profile</h2>
 
//       <div className="mb-3">
//         {!isEditing ? (
//           <button className="btn btn-primary" onClick={() => setIsEditing(true)}>Edit Profile</button>
//         ) : (
//           <>
//             <button className="btn btn-success me-2" onClick={handleSave}>Save Changes</button>
//             <button className="btn btn-secondary" onClick={() => setIsEditing(false)}>Cancel</button>
//           </>
//         )}
//       </div>
 
//       <div className="row">
//         {Object.entries(admin).map(([key, value]) => (
//           key !== "id" && key !== "resetToken" && (
//             <div className="col-md-6 mb-3" key={key}>
//               <label className="form-label">{key.charAt(0).toUpperCase() + key.slice(1)}</label>
//               {isEditing ? (
//                 <input
//                   type={key === "password" ? "password" : "text"}
//                   className="form-control"
//                   name={key}
//                   value={value}
//                   onChange={handleChange}
//                 />
//               ) : (
//                 <p className="form-control view-mode">{value}</p>
//               )}
//             </div>
//           )
//         ))}
//       </div>
//     </div>
//   );
// }
 
// export default AdminProfileView;
 