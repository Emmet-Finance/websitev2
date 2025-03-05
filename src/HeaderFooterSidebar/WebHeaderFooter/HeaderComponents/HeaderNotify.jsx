import React, { useState } from "react";
import ReactGA from "react-ga";
// import Rocket from '../../../assets/img/web/rocket.svg';
import CloseButton from "../../../assets/img/web/CloseButton.svg";
import "./HeaderNotify.css";

function HeaderNotify() {
  const [isVisible, setIsVisible] = useState(true);

  // Function to handle the close button click
  const handleCloseClick = () => {
    // Hide the notification by updating the state
    setIsVisible(false);
    ReactGA.event({
      category: "User",
      action: "Clicked Button",
      label: "Join the Adventure",
    });
  };

  return isVisible ? (
    <div className="headerNotify">
      <div className="headerNotifyContent">
        <p>
         Attention! The  {" "}
          <a 
          href="https://bscscan.com/token/0x6b30f76CecE9F92D27f0e9Ad78312E77709E74A5" 
          target="_blank"
          >
            authentic EMMET address
          </a>
        </p>
      </div>
      <div className="closeNotify" onClick={handleCloseClick}>
        <img src={CloseButton} alt="CloseButton" />
      </div>
    </div>
  ) : null;
}

export default HeaderNotify;
