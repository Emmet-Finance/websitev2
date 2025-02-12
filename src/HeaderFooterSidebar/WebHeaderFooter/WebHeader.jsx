import React from "react";

import Logo1 from "../../assets/img/web/logo.svg";
import Logo2 from "../../assets/img/web/logo-2.svg";
import LogoMob from "../../assets/img/web/logo-mob.svg";
import HeaderNotify from "./HeaderComponents/HeaderNotify";
import HeaderNewBtns from "./HeaderComponents/HeaderNewBtns";

import "./WebHeader.css";
import HeaderRightBtn from "./HeaderComponents/HeaderRightBtn";
function WebHeader() {
  const isMobile = window.innerWidth <= 768;
  return (
    <header className="webHeader">
      {/* <HeaderNotify /> */}
      <div className="headerBottomContainer">
        <div className="container">
          <div className="navArea">
            <div className="navBrand">
              {isMobile ? null : (
                <a href="./">
                  <img src={Logo1} className="logo-1" alt="Emmet Logo" />
                  <img src={Logo2} className="logo-2" alt="Emmet Logo" />
                </a>
              )}
              <a href="./" className="mobLogo">
                <img src={LogoMob} alt="Emmet Logo" className="" />
              </a>
              <HeaderNewBtns />
            </div>
            <div className="headerRIght">
              {/* <HeaderRightBtn/> */}
              <a href="/bridge" className="launchApp">
                Launch dApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default WebHeader;
