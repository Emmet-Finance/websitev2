import React from "react";
// import { isMobile } from "react-device-detect";
import AirdropEmmet from "../../../assets/img/web/AirdropEmmet.svg";
import TokenSaleButton from "./TokenSaleButton";

import "./HeaderNewBtns.css";

export default function HeaderNewBtns() {

  return (
    <div className="headerBtn">
      <TokenSaleButton />
      

      {/* { // DESKTOP VIEW
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
      } */}

    </div>
  );
}
