import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css";

import { useAppDispatch } from "../../hooks/storage";
import { resetBridgeProgress } from "../../store/bridgeSlice";
import { resetBridgeTransactionData } from "../../store/explorerSlice";

function SidebarNav() {
  const location = useLocation();
  const dispatch = useAppDispatch();

  const isActive = (pathname) => {
    return location.pathname.includes(pathname);
  };

  const handleLinkClick = () => {
    document.body.classList.remove("activeMobileMenu");
    // Clear data

    // BridgeTransactiondetails
    dispatch(resetBridgeProgress());
    dispatch(resetBridgeTransactionData());
  };

  return (
    <div className="sidebarNav">
      <ul className="navlinks">
        <li>
          <Link
            to="/bridge"
            className={`navLink ${isActive("/bridge") && "active"}`}
            onClick={handleLinkClick}
          >
            <img src={"/img/nav-icon/nav-Icons-2.svg"} alt="NavIcon" />
            <span>Bridge</span>
          </Link>
        </li>
        <li>
          <Link
            to="/pool"
            className={`navLink ${isActive("/pool") && "active"}`}
            onClick={handleLinkClick}
          >
            <img src={"/img/nav-icon/Pool.svg"} alt="NavIcon" />
            <span>Pool</span>
            {/* <span className="soon">Soon</span> */}
          </Link>
        </li>
        <li>
          <Link
            to="/tokensale"
            className={`navLink ${isActive("/") && ""}`}
            onClick={handleLinkClick}
          >
            <img src={"/img/nav-icon/second-nav-Icons-1.svg"} alt="NavIcon" />
            <span>Token Sale</span>
            {/* <span className="soon">Soon</span> */}
          </Link>
        </li>
        <li>
          <Link
            to="#"
            className={`navLink ${isActive("/") && ""}`}
            onClick={handleLinkClick}
          >
            <img src={"/img/nav-icon/nav-Icons-6.svg"} alt="NavIcon" />
            <span>Staking</span>
            <span className="soon">Soon</span>
          </Link>
        </li>
        {/* <li>
          <Link
            to="/#"
            className={`navLink ${isActive("/explorer") && "active"}`}
            onClick={handleLinkClick}
          >
            <img src={"/img/nav-icon/nav-Icons-3.svg"} alt="NavIcon" />
            <span>Explorer</span>
            <span className="soon">Soon</span>
          </Link>
        </li>
        <li>
          <Link
            to="/#"
            className={`navLink ${location.pathname === "/swap" && "active"}`}
            onClick={handleLinkClick}
          >
            <img src={"/img/nav-icon/nav-Icons-1.svg"} alt="NavIcon" />
            <span>Swap</span>
            <span className="soon">Soon</span>
          </Link>
        </li>
        <li>
          <Link
            to="#"
            className={`navLink ${isActive("/") && ""}`}
            onClick={handleLinkClick}
          >
            <img src={"/img/nav-icon/nav-Icons-4.svg"} alt="NavIcon" />
            <span>Farm</span>
            <span className="soon">Soon</span>
          </Link>
        </li>
        <li>
          <Link
            to="#"
            className={`navLink ${isActive("/") && ""}`}
            onClick={handleLinkClick}
          >
            <img src={"/img/nav-icon/nav-Icons-5.svg"} alt="NavIcon" />
            <span>Loans</span>
            <span className="soon">Soon</span>
          </Link>
        </li> 
       
        <li>
          <Link
            to="#"
            className={`navLink ${isActive("/") && ""}`}
            onClick={handleLinkClick}
          >
            <img src={"/img/nav-icon/nav-Icons-7.svg"} alt="NavIcon" />
            <span>Governance</span>
            <span className="soon">Soon</span>
          </Link>
        </li> */}
      </ul>
    </div>
  );
}

export default SidebarNav;
