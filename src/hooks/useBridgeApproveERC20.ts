import { useState } from "react";
import {
  TTokenName,
  ChainNameToTypeChainName,
  ChainToDestinationDomain,
  TOKEN_DECIMALS,
} from "../types";
import { setBridgeError, setBridgeAllowance } from "../store/bridgeSlice";
import { useAppDispatch, useAppSelector } from "./storage";
import { useEthersSigner } from "./useEthersSigner";
import { chainFactory } from "../store/chainFactory";
import { Web3Helper } from "emmet.js/dist/chains";
import { AddressBookKeys, TonHelper } from "emmet.js";
import { setPoolAllowance } from "../store/poolSlice";

export default function useBridgeApproveERC20() {
  const dispatch = useAppDispatch();

  const bridge = useAppSelector((state) => state.bridge);
  const pool = useAppSelector((state) => state.pool);

  const signer = useEthersSigner();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  function handleApprove(isPool = false) {
    if (isPool) {
      (async () => {
        setIsLoading(true);
        const tokenName: TTokenName = pool.token as TTokenName;
        // @ts-ignore
        const decimals: number = TOKEN_DECIMALS[pool.token];
        const formattedAmount = Number(pool.amount) * 10 ** decimals;
        const handler: Web3Helper | TonHelper = await chainFactory.inner(
          // @ts-ignore
          ChainToDestinationDomain[ChainNameToTypeChainName[pool.chain]],
        ) as Web3Helper;
        const tokenAddress = await handler.getTokenAddress(tokenName);

        if ("address" in handler && signer) {
          const poolAddress = await handler.address(
            `elp${pool.token}` as AddressBookKeys,
          );

          console.log({ poolAddress });

          await chainFactory.preTransfer(
            handler,
            signer!!,
            tokenAddress,
            poolAddress,
            BigInt(Math.ceil(formattedAmount)),
            {},
          );

          setIsSuccess(true);
          dispatch(setPoolAllowance(formattedAmount * 10 ** decimals));
          dispatch(setBridgeError(""));
          setIsLoading(false);
        }
      })().catch((e) => {
        console.warn(e.message);
        dispatch(setBridgeError(e.message));
        setIsLoading(false);
      });
    } else {
      (async () => {
        setIsLoading(true);
        const tokenName: TTokenName = bridge.fromToken as TTokenName;
        const decimals: number = TOKEN_DECIMALS[tokenName];
        const formattedAmount = Number(bridge.amount) * 10 ** decimals;
        const handler: Web3Helper | TonHelper = await chainFactory.inner(
          // @ts-ignore
          ChainToDestinationDomain[ChainNameToTypeChainName[bridge.fromChain]],
        ) as Web3Helper;
        const tokenAddress = await handler.getTokenAddress(tokenName);
        const bridgeAddress = await handler.bridge();

        console.log({ bridgeAddress });

        await chainFactory.preTransfer(
          handler,
          signer!,
          tokenAddress,
          bridgeAddress,
          BigInt(Math.ceil(formattedAmount)),
          {},
        );

        setIsSuccess(true);
        dispatch(setBridgeAllowance(formattedAmount * 10 ** decimals));
        dispatch(setBridgeError(""));
        setIsLoading(false);
      })().catch((e) => {
        console.warn(e.message);
        dispatch(setBridgeError(e.message));
        setIsLoading(false);
      });
    }
  }

  return {
    isApproveLoading: isLoading,
    isApproveSuccess: isSuccess,
    approve: handleApprove,
  };
}
