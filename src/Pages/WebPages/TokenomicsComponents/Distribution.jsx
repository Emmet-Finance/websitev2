import React from "react";

import "./Distribution.css";
import EmmetSupply from "../../../assets/img/web/Tokenomics/Distribution/pie-chart-desk.svg";

function Distribution() {
  return (
    <div className="distributionContainer">
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <div className="dustruLeft">
              <h2>$EMMET Distribution</h2>
              <img
                src={EmmetSupply}
                alt="Distribution"
                className="distribution forMob"
              />
              <div className="distributionBox">
                <h4>Investors</h4>
                <ul>
                  <li>
                    <span className="colorBox pseed"></span> <span>8%</span>{" "}
                    Pre-Seed (open)
                  </li>
                  <li>
                    <span className="colorBox prse"></span> <span>5%</span>{" "}
                    Private Seed
                  </li>
                  <li>
                    <span className="colorBox stratInv"></span> <span>5%</span>{" "}
                    Strategic Investors
                  </li>
                  <li>
                    <span className="colorBox comsal"></span> <span>1%</span>{" "}
                    KOLs (influencers)
                  </li>
                  <li>
                    <span className="colorBox publicSale"></span>{" "}
                    <span>1.5%</span> Launchpad Sale
                  </li>
                  <li>
                    <span className="colorBox publicSale"></span>{" "}
                    <span>7%</span> CEX/DEX Listing (IDO)
                  </li>
                </ul>
              </div>
              <div className="distributionBox">
                <h4>Ecosystem</h4>
                <ul>
                <li>
                    <span className="colorBox publicSale"></span> <span>2%</span>{" "}
                    Advisors
                  </li>
                  <li>
                    <span className="colorBox teamCore"></span> <span>12%</span>{" "}
                    Team
                  </li>
                  <li>
                    <span className="colorBox marketingPar "></span> <span>7%</span>{" "}
                    Cross-chain growth
                  </li>
                  <li>
                    <span className="colorBox liquiRew"></span>{" "}
                    <span>10%</span> Marketing
                  </li>
                  <li>
                    <span className="colorBox stakingRew"></span>{" "}
                    <span>7.5%</span> Treasury
                  </li>
                  <li>
                    <span className="colorBox echoSys"></span> <span>7%</span>{" "}
                    Staking rewards
                  </li>
                  <li>
                    <span className="colorBox echoSys"></span> <span>24%</span>{" "}
                    Strategic reserve
                  </li>
                  <li>
                    <span className="colorBox airdrop"></span> <span>3%</span>{" "}
                    Airdrop
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="dustruRight">
              <img
                src={EmmetSupply}
                alt="Distribution"
                className="distribution"
              />
            </div>
          </div>
        </div>
        <div className="distributionContent"></div>
      </div>
    </div>
  );
}

export default Distribution;
