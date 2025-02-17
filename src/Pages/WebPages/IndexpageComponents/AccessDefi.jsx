import React from "react";

import "./AccessDefi.css";

import Link from "../../../assets/img/web/Link.svg";
import DefiDesk from "../../../assets/img/web/defi.jpg";
import DefiDeskBg from "../../../assets/img/web/defiBg.png";
import DefiDeskArt1 from "../../../assets/img/web/defi-art-1.png";
import DefiDeskArt2 from "../../../assets/img/web/defi-art-2.png";

import DefimobArt1 from "../../../assets/img/web/defi-art-1.1.png";
import DefimobArt2 from "../../../assets/img/web/defi-art-2.2.png";

function AccessDefi() {
  const isMobile = window.innerWidth <= 768;
  return (
    <div className="AccessDefiContainer">
      <div className="container">
        <div className="AccessDefi">
          <img src={DefiDeskBg} alt="DefiDesk" className="defiBgDesk" />
          {isMobile ? null : (
            <img
              src={DefiDeskArt1}
              className="DefiDeskArt-1"
              alt="Defi Background"
            />
          )}
          {isMobile ? null : (
            <img
              src={DefiDeskArt2}
              className="DefiDeskArt-2"
              alt="Defi Background Desk"
            />
          )}

          <img
            src={DefimobArt1}
            className="DefiMobArt-1"
            alt="Defi Background Desk"
          />
          <img
            src={DefimobArt2}
            className="DefiMobArt-2"
            alt="Defi Background Desk"
          />
          <div className="AccessDefiInner">
            <h2>EMMET is your access to DeFi freedom</h2>
            <p>
              Participate in the future of decentralized finance by joining our
              EMMET token sale. Secure your stake in the evolution of
              cross-chain DeFi, unlocking exclusive benefits and contributing to
              the growth of the Emmet Finance ecosystem
            </p>
            {/* https://form.jotform.com/231456892158061  investor form */}
            <a
              href="/tokensale"
              className="whiteBtn"
            >
              Tokensale<img src={Link} alt="Link" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccessDefi;
