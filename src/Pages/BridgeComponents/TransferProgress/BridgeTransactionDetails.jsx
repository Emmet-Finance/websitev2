import React, { useEffect, useState } from "react";
import "./BridgeTransactionDetails.css";
import useBridgeFee from "../../../hooks/useBridgeFee";
import { useAppSelector } from "../../../hooks/storage";
import {
  ChainNameToTypeChainName,
  CHAIN_NAME_TO_ID,
  TOKEN_SYMBOL_TO_TOKEN,
} from "../../../types";
import { removeTrailingZeroes } from "../../../utils";
import { chainFactory } from "../../../store/chainFactory";
import { ChainToDestinationDomain } from "../../../types";
import { msToTime } from "../../../utils/msToTime";

function BridgeTransactionDetails() {
  const bridge = useAppSelector((state) => state.bridge);

  const { nativeCurrency, protocolFee } = useBridgeFee();
  const [estimatedTime, setEstimatedTime] = useState(40 * 1000);

  useEffect(() => {
    (async () => {
      try {
        const handler = await chainFactory.inner(
          ChainToDestinationDomain[ChainNameToTypeChainName[bridge.fromChain]],
        );

        const time = await handler.estimateTime(
          // eslint-disable-next-line no-undef
          BigInt(CHAIN_NAME_TO_ID[ChainNameToTypeChainName[bridge.toChain]]),
          bridge.fromToken,
          bridge.toToken,
        );
        if (time) {
          setEstimatedTime(Number(time));
        }
      } catch (error) {
        console.log(error);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bridge.fromChain, bridge.toChain, bridge.fromToken, bridge.toToken]);

  return (
    <ul className="bridgeTransactionDetails">
      <li className="bridgeTransactionDetailsList">
        <div className="bridgeTransDetLeft">You will receive</div>
        <div className="bridgeTransDetRight">
          {removeTrailingZeroes(Number(bridge.receive).toFixed(8))}{" "}
          {TOKEN_SYMBOL_TO_TOKEN[bridge.toToken]}
        </div>
      </li>
      {/* <li className="bridgeTransactionDetailsList">
        <div className="bridgeTransDetLeft">Protocol Fee</div>
        <div className="bridgeTransDetRight">
          {protocolFee} {nativeCurrency}
           {formattedFee && formattedFee.toFixed(6)} {nativeCurrency}
        </div>
      </li>
      <li className='bridgeTransactionDetailsList'>
                <div className="bridgeTransDetLeft">
                    Destination Gas Fee (Est.)
                </div>
                <div className="bridgeTransDetRight">
                    {destCircleClaimFee[ChainNameToTypeChainName[bridge.toChain]].toFixed(7)} {destCurrency}
                </div>
            </li> */}
      <li className="bridgeTransactionDetailsList">
        <div className="bridgeTransDetLeft">
          Estimated waiting time
          {/* <img src="./img/InfoIcons.svg" alt="InfoIcons" /> */}
        </div>
        <div className="bridgeTransDetRight">{msToTime(estimatedTime)}</div>
      </li>
    </ul>
  );
}

export default BridgeTransactionDetails;
