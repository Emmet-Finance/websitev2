import React from "react";
import { isMobile } from "react-device-detect";
import AirdropEmmet from "../../../assets/img/web/AirdropEmmet.svg";
import EmmetTokken from "../../../assets/img/web/EmmetTokken.svg";

import "./HeaderNewBtns.css";

export default function HeaderNewBtns() {

  const isTokensalePage = window.location.href.includes("/tokensale");

  return (
    <div className="headerBtn">
      {
        
        !isTokensalePage 
        ? (<a href="#" // https://emmet.finance/tokensale
          // target='_blank'
          className='EmmetTokken'
          rel="noreferrer noopener"
        >
          $EMMET Pre-sale {!isMobile && <>Feb 17th</>}
          <img src={EmmetTokken} alt="EmmetTokken" />
        </a>)
        : (<></>)
      }
      

      { // DESKTOP VIEW
        !isMobile
          ? (<a
            href="https://zealy.io/cw/emmet-finance/"
            target="_blank"
            rel="noreferrer noopener"
            className="AirdropEmmet"
            style={{ fontSize: "14px" }}
          >
            🔥 Zealy Sprint
            <img src={AirdropEmmet} alt="AirdropEmmet" />
          </a>)
          : (<></>)
      }

    </div>
  );
}
