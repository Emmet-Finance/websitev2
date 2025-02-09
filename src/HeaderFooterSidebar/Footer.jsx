import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <footer id="footerArea">
      <div className="container">
        <div className="footerRow">
          <div className="leftCol">
            <p></p>
          </div>
          <div className="centerCol">
            <div className="footerNav">
              <a href="/terms-of-service">Terms of Service</a>
              <span>|</span>
              <a href="/privacy-policy">Privacy Policy</a>
            </div>
          </div>
          <div className="rightCol">
            <p className="powerBy">
              © 2025 Emmet.Finance, All Rights Reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
