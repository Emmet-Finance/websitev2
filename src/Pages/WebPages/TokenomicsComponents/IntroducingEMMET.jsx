import React from "react";
import { isMobile } from "react-device-detect";
import "./IntroducingEMMET.css";
import BuyEmmet from "./BuyEmmet";
import PricesTable from "./PricesTable";
import RefComponent from "./RefComponent";

function IntroducingEMMET() {

  return (
    <div className="introEmmetContainer">
      <div className="container introEmmetContent">
        {
          isMobile
            ? (<div className="row">
              <div className="col-lg  -6">
                <div className="introEmmetRight">
                  <BuyEmmet />
                </div>
              </div>
              <div className="col-lg  -6">
                <div className="introEmmetLeft">
                <p></p>
                <h2>Refer a friend</h2>
                <p></p>
                  <RefComponent />
                  <p></p>
                  <h1 className="align-center">
                    Introducing <br />
                    <span>$EMMET</span>
                  </h1>
                  <p>
                    EMMET native token unlocks the power of decentralized finance,
                    giving you access to a growing ecosystem of cutting-edge DeFi
                    tools and innovative blockchain applicatios.
                  </p>
                  <PricesTable />

                </div>
              </div>
            </div>)
            : (<div className="row">
              <div className="col-lg  -6">
                <div className="introEmmetLeft">
                  <h1 className="align-center">
                    Introducing <br />
                    <span>$EMMET</span>
                  </h1>
                  <p>
                    EMMET native token unlocks the power of decentralized finance,
                    giving you access to a growing ecosystem of cutting-edge DeFi
                    tools and innovative blockchain applicatios.
                  </p>
                  <PricesTable />
                  <p></p>
                  <RefComponent />
                </div>
              </div>

              <div className="col-lg  -6">
                <div className="introEmmetRight">
                  <BuyEmmet />
                </div>
              </div>
            </div>)
        }


      </div>
    </div>
  );
}

export default IntroducingEMMET;
