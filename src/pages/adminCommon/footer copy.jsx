import React from "react";
import "../../components/footer.css";

const Footer = () => {
  return (
    <footer>
      {/* Reference Links */}
      <div className="footer-links">
        <a
          href="https://www.linkedin.com/company/hospital-management"
          target="_blank"
          rel="noopener noreferrer"
        >
          LinkedIn
        </a>
        <a
          href="https://www.google.com/search?q=hospital+management+system"
          target="_blank"
          rel="noopener noreferrer"
        >
          Google
        </a>
        <a
          href="https://www.who.int"
          target="_blank"
          rel="noopener noreferrer"
        >
          WHO
        </a>
      </div>

      {/* Copyright */}
      <div>
        © {new Date().getFullYear()} Hospital Management System. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;