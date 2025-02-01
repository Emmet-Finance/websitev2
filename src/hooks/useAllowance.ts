import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useAppSelector, useAppDispatch } from "./storage";
import { ChainNameToTypeChainName, ChainToDestinationDomain, TOKEN_DECIMALS } from "../types";
import {
  setBridgeAllowance,
  setBridgeDecimals,
  setBridgeError,
} from "../store/bridgeSlice";
import { chainFactory } from "../store/chainFactory";
import { ethers } from "ethers";

export default function useBridgeAllowance() {
  const { address, isConnected } = useAccount();

  const dispatch = useAppDispatch();

  const bridge = useAppSelector((state) => state.bridge);

  function isApproveRequired() {
    // TON does not require approval
    if (bridge.fromChain === "TON" || bridge.fromChain === "TONTestnet") {
      return false;
    }

    return (
      Number(bridge.amount) >
      (Number(bridge.allowance) / 10 ** Number(bridge.decimals))
    );
  }

  const [allowance, setAllowance] = useState<string | number>(bridge.allowance);

  const [decimals, setDecimals] = useState<bigint>(
    bridge.decimals ? BigInt(bridge.decimals) : 18n,
  );

  const [error, setError] = useState<string | undefined>(undefined);

  const [isApprovalRequired, setIsApprovalRequired] = useState<boolean>(false);

  const updateAllowance = () => {
    (async () => {
      if (isConnected && bridge.fromChain && bridge.fromToken) {
        const handler = await chainFactory.inner(
          // @ts-ignore
          ChainToDestinationDomain[ChainNameToTypeChainName[bridge.fromChain]],
        );

        const token: string = await handler.getTokenAddress(bridge.fromToken);
        const tokenDecimals: number = TOKEN_DECIMALS[bridge.fromToken as keyof typeof TOKEN_DECIMALS];

        // console.log("fromToken", bridge.fromToken, "tokenAddress:", token, "tokenDecimals", tokenDecimals)

        if (
          token !== ethers.ZeroAddress &&
          bridge.senderAddress !== ""
        ) {
          setDecimals(BigInt(tokenDecimals));
          dispatch(setBridgeDecimals(Number(tokenDecimals)));

          const bridgeAddress: string = await handler.bridge();

          if ("getApprovedAmount" in handler) {
            const allowance = await handler.getApprovedAmount(
              token,
              bridge.senderAddress,
              bridgeAddress
            );
            setAllowance(Number(allowance));
            dispatch(setBridgeAllowance(Number(allowance)));
          }
        }
        if (isApproveRequired()) {
          setIsApprovalRequired(true);
        } else {
          setIsApprovalRequired(false);
        }

        if (error) setError(undefined);
        if (bridge.error) {
          dispatch(setBridgeError(undefined));
        }
      }
    })().catch((e) => {
      const formattedError = `useBridgeAllowance Error: ${e}`;
      console.error(formattedError);
      setError(formattedError);
      dispatch(setBridgeError(formattedError));
      // console.log("tokenAddress", tokenAddress, "spender", spender)
    });
  };

  useEffect(() => {
    updateAllowance();
  }, [address, bridge.amount, bridge.fromChain, bridge.fromToken]);

  return { allowance, decimals, error, isApprovalRequired, updateAllowance };
}
