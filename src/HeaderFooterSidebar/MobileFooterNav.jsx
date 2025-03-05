import React from "react";
import { Link, useLocation } from "react-router-dom";

function MobileFooterNav() {
  const location = useLocation();

  const isActive = (pathname) => {
    return location.pathname === pathname;
  };
  return (
    <div className="mobileFooterNav">
      <ul className="navlinks">
        <li>
          <Link
            to="/bridge"
            className={`navLink ${isActive("/bridge") && "active"}`}
          >
            <img src={"/img/nav-icon/nav-Icons-2.svg"} alt="NavIcon" />
            <span>Bridge</span>
          </Link>
        </li>
        <li>
          <Link
            to="/pool"
            className={`navLink ${isActive("/pool") && "active"}`}
          >
            <img src={"/img/nav-icon/Pool.svg"} alt="NavIcon" />
            <span>Pool</span>
            {/* <span className="soon">Soon</span> */}
          </Link>
        </li>
        <li>
          <Link to="/tokensale" className="navLink">
            <img src={"/img/nav-icon/second-nav-Icons-1.svg"} alt="NavIcon" />
            <span>Sale</span>
          </Link>
        </li>
        <li>
          <Link to="/staking" className="navLink">
            <img src={"/img/nav-icon/nav-Icons-6.svg"} alt="NavIcon" />
            <span>Stake</span>
          </Link>
        </li>
        {/* <li>
          <Link
            to="/#"
            className={`navLink ${isActive("/explorer") && "active"}`}
          >
            <img src={"/img/nav-icon/nav-Icons-3.svg"} alt="NavIcon" />
            <span>Explorer</span>
            <span className="soon">Soon</span>
          </Link>
        </li>
        <li>
          <Link to="#" className={`navLink ${isActive("/swap") && "active"}`}>
            <img src={"/img/nav-icon/nav-Icons-1.svg"} alt="NavIcon" />
            <span>Swap</span>
            <span className="soon">Soon</span>
          </Link>
        </li>

        <li>
          <Link to="#" className="navLink">
            <img src={"/img/nav-icon/nav-Icons-4.svg"} alt="NavIcon" />
            <span>Farm</span>
            <span className="soon">Soon</span>
          </Link>
        </li>
        <li>
          <Link to="#" className="navLink">
            <img src={"/img/nav-icon/nav-Icons-5.svg"} alt="NavIcon" />
            <span>Loans</span>
            <span className="soon">Soon</span>
          </Link>
        </li>
        <li>
          <Link to="#" className="navLink">
            <img src={"/img/nav-icon/nav-Icons-6.svg"} alt="NavIcon" />
            <span>Stake</span>
            <span className="soon">Soon</span>
          </Link>
        </li>
        <li>
          <Link to="#" className="navLink">
            <img src={"/img/nav-icon/nav-Icons-7.svg"} alt="NavIcon" />
            <span>Governance</span>
            <span className="soon">Soon</span>
          </Link>
        </li> */}
      </ul>
    </div>
  );
}

export default MobileFooterNav;
