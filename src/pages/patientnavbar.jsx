import React from "react";
import { Navbar, Nav, Container, NavDropdown} from "react-bootstrap";
import { FaBell } from "react-icons/fa";
 
function PatientNavBar() {
 

  const handleLogout = () => {
    // Clear session or token if stored
    localStorage.clear();
    sessionStorage.clear();

    // Show logout message
    alert('Logout successfully');
 
  return (
    <div>
      {/* Navbar */}
      <Navbar expand="lg" style={{ backgroundColor: "#2c3e50" }} variant="dark" sticky="top">
        <Container>
          <Navbar.Brand href="/dashboard" style={{ fontWeight: "bold", fontSize: "20px" ,textAlign:"left"}}>
            HMS
          </Navbar.Brand>
          <Nav className="me-auto">
           
            <Nav.Link href="/book">Book Appointment</Nav.Link>
            <Nav.Link href="/appointments">Appointment List</Nav.Link>
          </Nav>
          <Navbar.Brand className="mx-auto" style={{ fontWeight: "bold", fontSize: "22px" ,textAlign:"center"}}>
            Patient Dashboard
          </Navbar.Brand>
 
          <Nav className="ms-auto">
          {/* 🔔 Notification bell */}
          <Nav.Link  href="/notifications">
            <FaBell size={20} color="white" style={{marginLeft: "300px"}}/>
          </Nav.Link>
          </Nav>
         
          <Nav className="ms-auto">
            <NavDropdown title="Profile" id="profile-dropdown" align="end">
              <NavDropdown.Item href="/profile">View/Update Profile</NavDropdown.Item>
              <NavDropdown.Item href="/changepassword">Change Password</NavDropdown.Item>
              <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Container>
      </Navbar>
 
     
    </div>
  );
}
 

}
export default PatientNavBar;
 