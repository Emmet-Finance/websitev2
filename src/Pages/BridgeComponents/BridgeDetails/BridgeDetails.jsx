import React from "react";
import CheckGreen from "../../../assets/img/CheckGreen.svg";

import BridgeFee from "./BridgeFee";
import BridgingTimeEstimation from "./BridgingTimeEstimation";

import { useAppSelector } from "../../../hooks/storage";
import { bnWithoutDecimals } from "../../../utils/";
import useBridgeAllowance from "../../../hooks/useAllowance";
import { TOKEN_SYMBOL_TO_TOKEN } from "../../../types";

function BridgeDetails() {
  const bridge = useAppSelector((state) => state.bridge);

  const { allowance, updateAllowance } = useBridgeAllowance();

  const [tokenName, setTokenName] = React.useState(bridge.fromToken);

  React.useEffect(() => {
    setTokenName(bridge.fromToken);
  }, [bridge.fromToken]);

  React.useEffect(() => {
    updateAllowance();
  }, [bridge.allowance, bridge.fromToken, bridge.fromChain]);

  return (
    <div className="bridgeDetails">
      <BridgeFee />
      <BridgingTimeEstimation />
      {/* NO ALLOWANCE ON TON */}
      {bridge.fromChain.toLocaleLowerCase() !== 'ton'
        ? (<div className="detialItem">
          <div className="detialItemLeft">Token allowance</div>
          <div className="detialItemRight">
            <img src={CheckGreen} alt="CheckGreen" />
            {bnWithoutDecimals(allowance, bridge.fromToken)} {TOKEN_SYMBOL_TO_TOKEN[tokenName]}
          </div>
        </div>)
        : ""
      }

    </div>
  );
}

export default BridgeDetails;
