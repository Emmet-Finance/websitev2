import { useEffect } from "react";
import { useAccount } from "wagmi";
import { useTonAddress } from "@tonconnect/ui-react";
import { useAppDispatch, useAppSelector } from "./storage";
import { ChainNameToTypeChainName, TDirection, TNetwork } from "../types";
import { TChainName } from "emmet.js";
import { setReceiver, setSenderAddress } from "../store/bridgeSlice";
import { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import { isValidTonAddress } from "../verifiers";
import { isEvmAddress } from "../utils";

const tonChains: TChainName | string[] = ['ton', 'tontestnet'];
const solanaChains: TChainName | string[] = ['solana'];

//  P R O T O C O L   S E L E C T O R
function whichProtocol(chainName: TChainName): TNetwork {

    const protocol = tonChains.includes(ChainNameToTypeChainName[chainName])
        ? "TON"
        : solanaChains.includes(ChainNameToTypeChainName[chainName])
            ? "SOLANA"
            : "EVM";

    return protocol;
}

export default function useBridgeAccounts() {

    const dispatch = useAppDispatch();
    const bridge = useAppSelector((state) => state.bridge);
    let toProtocol: TNetwork = whichProtocol(bridge.toChain as TChainName);

    //   I N J E C T E D    A C C O U N T S
    const evmAccount = useAccount();
    const tonAddress: string = useTonAddress();

    useEffect(() => {

        //  I S  A C T I V E  C H E C K
        const isEvmActive: boolean = !!(evmAccount && evmAccount.isConnected && evmAccount.address);
        const isTonConnected: boolean = tonAddress.length > 0;


        //  A C C O U N T S  S E T T E R
        function setAccounts(
            protocol: TNetwork,
            direction: TDirection,
            setAccount: ActionCreatorWithPayload<string, "bridge/setReceiver" | "bridge/setSenderAddress">
        ) {

            const isTo: boolean = direction === "to";

            if (protocol === "TON") {
                if(isTonConnected){
                    dispatch(setAccount(tonAddress));
                } else if(isTo){
                    if(!isValidTonAddress(bridge.receiver)){
                        dispatch(setAccount(""));
                    }
                }
            } else if (protocol === "SOLANA") {
                if(isTo){
                    // if(!isValidSolanaAddress(bridge.receiver)){
                    //     dispatch(setAccount(""));
                    // }
                }
            } else if (protocol === "EVM") {
                if(isEvmActive){
                    dispatch(setAccount(evmAccount.address as string));
                } else if(isTo){
                    if(!isEvmAddress(bridge.receiver)){
                        dispatch(setAccount(""));
                    }
                }
                
            } else {
                dispatch(setAccount(""));
            }
        }

        //  F R O M   N E T W O R K  S E T U P
        const fromProtocol = whichProtocol(bridge.fromChain as TChainName);
        setAccounts(fromProtocol, "from", setSenderAddress);

        //  T O   N E T W O R K  S E T U P
        toProtocol = whichProtocol(bridge.toChain as TChainName);
        setAccounts(toProtocol, "to", setReceiver);

    }, [bridge.fromChain, bridge.toChain, bridge.receiver, evmAccount, tonAddress, dispatch]);

    return {
        evmAccount,
        tonAddress,
        toProtocol
    }
}