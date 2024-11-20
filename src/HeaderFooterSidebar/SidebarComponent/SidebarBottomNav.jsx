import React from "react";
import "./Sidebar.css";

function SidebarBottomNav() {
  return (
    <div className="SidebarBottomNav sidebarNav">
      <ul className="navlinks">
        <li>
          <a href="#" className="navLink">
            <img src={"/img/nav-icon/second-nav-Icons-1.svg"} alt="NavIcon" />
            <span>News</span>
          </a>
        </li>
        <li>
          <a
            href="https://doc.emmet.finance/"
            target="_blank"
            className="navLink"
          >
            <img src={"/img/nav-icon/second-nav-Icons-2.svg"} alt="NavIcon" />
            <span>Docs</span>
          </a>
        </li>
        <li>
          <a
            href="https://github.com/Emmet-Finance/emmet.sdk.v3"
            target="_blank"
            className="navLink"
          >
            <img src={"/img/nav-icon/second-nav-Icons-3.svg"} alt="NavIcon" />
            <span>SDK</span>
          </a>
        </li>
        <li>
          <a href="#" className="navLink">
            <img src={"/img/nav-icon/second-nav-Icons-4.svg"} alt="NavIcon" />
            <span>Widget</span>
          </a>
        </li>
      </ul>
    </div>
  );
}

export default SidebarBottomNav;
