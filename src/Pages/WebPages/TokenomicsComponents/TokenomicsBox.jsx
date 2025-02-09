import React from "react";

import "./TokenomicsBox.css";
import Bridge from "../../../assets/img/web/Tokenomics/unity/1.svg";
import Staking from "../../../assets/img/web/Tokenomics/unity/2.svg";
import Validator from "../../../assets/img/web/Tokenomics/unity/3.svg";
import Liquidity from "../../../assets/img/web/Tokenomics/unity/4.svg";
import Farming from "../../../assets/img/web/Tokenomics/unity/5.svg";
import Borrow from "../../../assets/img/web/Tokenomics/unity/6.svg";
import Voting from "../../../assets/img/web/Tokenomics/unity/7.svg";

import BSC from "../../../assets/img/bsc.svg";
import CopyAddress from "../../../assets/img/web/Tokenomics/Copy.svg";

const emmetAddress = "0x6b30f76CecE9F92D27f0e9Ad78312E77709E74A5";

const handleCopyClick = () => {
  (async () => {
    await navigator.clipboard.writeText(emmetAddress);
  })();
}

function TokenomicsBox() {
  return (
    <>
      <div className="tokenomicsBoxContainer">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <div className="tokenomicsBox emmetUnity">
                <h2>$EMMET Utility</h2>
                <ul>
                  <li>
                    <img src={Bridge} alt="Bridge" />
                    <p>Bridge Fees</p>
                  </li>
                  <li>
                    <img src={Staking} alt="Staking" />
                    <p>Staking Incentives</p>
                  </li>
                  <li>
                    <img src={Validator} alt="Validator" />
                    <p>Validator Rewards</p>
                  </li>
                  <li>
                    <img src={Liquidity} alt="Liquidity" />
                    <p>Liquidity Pools Equivalent</p>
                  </li>
                  <li>
                    <img src={Farming} alt="Farming" />
                    <p>Farming & Reward</p>
                  </li>
                  <li>
                    <img src={Borrow} alt="Borrow" />
                    <p>Borrow and Lend</p>
                  </li>
                  <li>
                    <img src={Voting} alt="Voting" />
                    <p>Voting Power</p>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-md-6">
              <div className="tokenomicsBox tokenMetrics">
                <h2>Token Metrics</h2>
                <ul>
                  <li>
                    <div className="metricsLeft">Token Name</div>
                    <div className="metricsRight">$EMMET</div>
                  </li>
                  <li>
                    <div className="metricsLeft">Token Address</div>
                    <div className="metricsRight">
                      <div className="metricAddress">
                        <img src={BSC} alt="BSC" style={{ "width": "30px" }} />
                        <a href="https://bscscan.com/address/0x6b30f76CecE9F92D27f0e9Ad78312E77709E74A5" target="_blank" rel="noopener noreferrer">
                          <p className="linkAddress">{`${emmetAddress.slice(0, 4)}...${emmetAddress.slice(38,)}`}</p>
                        </a>
                        <button className="copyLink" onClick={() => handleCopyClick()}>
                          <span className="copyAddressLink">
                            <img src={CopyAddress} alt="Copy" />
                          </span>
                        </button>

                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="metricsLeft">Round</div>
                    <div className="metricsRight">
                      <span className="preSeed">Pre-Seed</span>
                    </div>
                  </li>
                  <li>
                    <div className="metricsLeft">Token Price</div>
                    <div className="metricsRight">$0.01</div>
                  </li>
                  <li>
                    <div className="metricsLeft">Allocated Supply</div>
                    <div className="metricsRight">8% (80,000,000 $EMMET)</div>
                  </li>
                  <li>
                    <div className="metricsLeft">Hard Cap</div>
                    <div className="metricsRight">$800,000</div>
                  </li>
                  <li>
                    <div className="metricsLeft">Fully Diluted Value</div>
                    <div className="metricsRight">$10,000,000</div>
                  </li>
                  <li>
                    <div className="metricsLeft">Purchase Minimum Limit</div>
                    <div className="metricsRight">$20$</div>
                  </li>
                  <li>
                    <div className="metricsLeft">Lockup Terms</div>
                    <div className="metricsRight">
                      Imediately (40%) / Vesting (60%) - 6 mon
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default TokenomicsBox;
