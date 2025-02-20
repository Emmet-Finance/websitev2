import React from "react";
import "./BuyEmmet.css";
import CountdownTimer from "./CountdownTimer";

import lineLeft from "../../../assets/img/web/Tokenomics/BuyEmmet/line-left.png";
import lineRight from "../../../assets/img/web/Tokenomics/BuyEmmet/line-right.png";
import BuyEmmetCoin from "./BuyEmmetCoin";
import NotifyMe from "./NotifyMe";
import { isMobile } from "react-device-detect";

function BuyEmmet() {
  const targetDate = new Date("March 15, 2025 00:00:00 GMT+00:00");

  return (
    <>
      <div className="buyEmmet">
        <h3>Buy $EMMET</h3>
        <div className="buyEmmetInner">
          <div className="buyTopBoxWrap">
            <div className="buyTopBox buyPreeSeed">
              <h5>Pre-Seed</h5>
              <h6>
                Hard Cap <span>$800K</span>
              </h6>
              <div className="preseedLine">
                <div className="preseedLineProgress"></div>
              </div>
            </div>
            <div className="buyTopBox inactive buyPriSeed">
              <h5>Private Seed</h5>
              <NotifyMe />
            </div>
            <div className="buyTopBox inactive buyCommu">
              <h5>Community</h5>
              <NotifyMe />
            </div>
          </div>
          <div className="emmetTousd">
            <img src={lineLeft} className="lineImg" alt="Line" />
            <span>1 EMMET = $0.01</span>
            <img src={lineRight} className="lineImg" alt="Line" />
          </div>
          <div className="priceIncress">
            <p>EMMET price increases to $0.012 in:</p>
            <div className="timer">
              <CountdownTimer targetDate={targetDate} />
            </div>
          </div>
          <BuyEmmetCoin />
        </div>
      </div>
      <div className={`buyEmmetFooter ${!isMobile ? "padding-left-100" : ""}`}>
        Min contribution: <span>20.00 USDT</span>
      </div>
    </>
  );
}

export default BuyEmmet;
