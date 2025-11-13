import React, { useContext } from "react";
import { Navbar, Container, Nav } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const TopNavbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const isLoginPage = location.pathname === "/login";
  const isRegisterPage = location.pathname === "/register";

  function onLogout() {
    logout();
    navigate("/login");
  }

  return (
    <Navbar expand="lg" style={{ backgroundColor: "#2c3e50" }} className="shadow-sm">
      <Container fluid className="px-4" style={{ display: "flex", alignItems: "center" }}>
        <Navbar.Brand
          className="mx-auto text-center"
          style={{ color: "#ffffff", fontSize: "30px", fontWeight: "500", paddingLeft: "300px" }}
        >
          Hospital Management System
        </Navbar.Brand>

        <Nav className="ms-auto" style={{ gap: "15px" }}>
          <Nav.Link as={Link} to="/about" style={{ color: "#ffffff" }}>
            About HMS
          </Nav.Link>
          <Nav.Link as={Link} to="/details" style={{ color: "#ffffff" }}>
            More Details
          </Nav.Link>

          {/* Show Login only if not logged in and not on login page */}
          {!user && !isLoginPage && (
            <Nav.Link as={Link} to="/login" style={{ color: "#ffffff" }}>
              Login
            </Nav.Link>
          )}

          {/* Show Register only if not logged in and not on register page */}
          {!user && !isRegisterPage && (
            <Nav.Link as={Link} to="/register" style={{ color: "#ffffff" }}>
              Register
            </Nav.Link>
          )}

          {/* Show Logout only if logged in */}
          {user && (
            <Nav.Link onClick={onLogout} style={{ color: "#ffffff", cursor: "pointer" }}>
              Logout
            </Nav.Link>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
};

export default TopNavbar;
// import React from "react";
// import { Navbar, Container, Nav } from "react-bootstrap";
// import { Link } from "react-router-dom";

// const TopNavbar = () => {
//   return (
//     <Navbar expand="lg" style={{ backgroundColor: "#2c3e50" }} className="shadow-sm">
//       <Container fluid className="px-4" style={{ display: "flex", alignItems: "center" }}>
//         {/* Left-aligned link */}
//         <Nav className="me-auto">
//           <Nav.Link as={Link} to="/dashboard" style={{ color: "#ffffff" }}>
//             Dashboard
//           </Nav.Link>
//         </Nav>

//         {/* Centered title */}
//         <Navbar.Brand
//           className="mx-auto text-center"
//           style={{ color: "#ffffff", fontSize: "20px", fontWeight: "500" }}
//         >
//           Hospital Management System
//         </Navbar.Brand>

//         {/* Right-aligned links */}
//         <Nav className="ms-auto" style={{ gap: "15px" }}>
//           <Nav.Link as={Link} to="/about" style={{ color: "#ffffff" }}>
//             About HMS
//           </Nav.Link>
//           <Nav.Link as={Link} to="/details" style={{ color: "#ffffff" }}>
//             More Details
//           </Nav.Link>
//         </Nav>
//       </Container>
//     </Navbar>
//   );
// };

// export default TopNavbar;