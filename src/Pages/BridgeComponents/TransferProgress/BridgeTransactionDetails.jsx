import React from 'react';
import './BridgeTransactionDetails.css';
import useBridgeFee from '../../../hooks/useBridgeFee';
import { useAppSelector } from '../../../hooks/storage';
import { SUPPORTED_CHAINS, ChainNameToTypeChainName, destCircleClaimFee, EstimatedTimeFromChain } from '../../../types';
import { getDestinationFee, removeTrailingZeroes } from '../../../utils';

function BridgeTransactionDetails() {

    // const { nativeCurrency, formattedFee } = useBridgeFee();
    const bridge = useAppSelector((state) => state.bridge);

    const {nativeCurrency, formattedFee} = useBridgeFee()

    const destCurrency = SUPPORTED_CHAINS[ChainNameToTypeChainName[bridge.toChain]].nativeCurrency.symbol;

    return ( 
        <ul className="bridgeTransactionDetails">
            <li className='bridgeTransactionDetailsList'>
                <div className="bridgeTransDetLeft">
                    You will receive
                </div>
                <div className="bridgeTransDetRight">
                    {removeTrailingZeroes(Number(bridge.receive).toFixed(8))} {bridge.toToken}
                </div>
            </li>
            <li className='bridgeTransactionDetailsList'>
                <div className="bridgeTransDetLeft">
                    Protocol Fee
                </div>
                <div className="bridgeTransDetRight">
                    {formattedFee} {nativeCurrency}
                {/* {formattedFee && formattedFee.toFixed(6)} {nativeCurrency} */}
                </div>
            </li>
            {/* <li className='bridgeTransactionDetailsList'>
                <div className="bridgeTransDetLeft">
                    Destination Gas Fee (Est.)
                </div>
                <div className="bridgeTransDetRight">
                    {destCircleClaimFee[ChainNameToTypeChainName[bridge.toChain]].toFixed(7)} {destCurrency}
                </div>
            </li> */}
            <li className='bridgeTransactionDetailsList'>
                <div className="bridgeTransDetLeft">
                    Estimated waiting time 
                    {/* <img src="./img/InfoIcons.svg" alt="InfoIcons" /> */}
                </div>
                <div className="bridgeTransDetRight">
                    {EstimatedTimeFromChain[ChainNameToTypeChainName[bridge.fromChain]]}
                </div>
            </li>
        </ul>
     );
}

export default BridgeTransactionDetails;