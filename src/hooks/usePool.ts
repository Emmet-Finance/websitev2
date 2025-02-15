import { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import { AddressBookKeys, sleep } from "emmet.js";
import { useAppDispatch, useAppSelector } from "./storage";
import {
  ChainNameToTypeChainName,
  SUPPORTED_CHAINS,
  TOKEN_DECIMALS,
  TTokenName,
} from "../types";
import { chainFactory } from "../store/chainFactory";
import { useEthersSigner } from "./useEthersSigner";
import {
  setPoolBalance,
  setPoolStakedBalance,
} from "../store/poolSlice";
import { useTonConnect } from "./useTonConnect";
import { getHandler, isValidAddress } from "../utils/emmetjs";

export default function usePool() {

  // Hooks
  const location = useLocation();
  const dispatch = useAppDispatch();

  // Injected accounts
  const signer = useEthersSigner();
  const { sender: tonSender } = useTonConnect();

  // State Slices
  const pool = useAppSelector((state) => state.pool);
  const bridge = useAppSelector((state) => state.bridge);

  // Local state
  const [error, setError] = useState("");
  const [isLoadingBalance, setIsLoadingBalance] = useState<boolean>(false);

  // ======= H E L P E R  F U N C T I O N S =======

  const isPoolPath = location.pathname.includes('/pool');
  // ----------------------------------------------
  const stake = async () => {
    const handler = pool.chain && await getHandler(pool.chain);

    try {
      await chainFactory.stakeLiqiduity(
        // @ts-ignore
        handler,
        signer,
        pool.token,
        // @ts-ignore
        pool.amount * 10 ** TOKEN_DECIMALS[pool.token],
        undefined,
      );
    } catch (error: { message: string } | any) {
      // For TON
      await chainFactory.stakeLiqiduity(
        // @ts-ignore
        handler,
        tonSender,
        pool.token,
        // @ts-ignore
        BigInt(pool.amount * 10 ** TOKEN_DECIMALS[pool.token]),
        undefined,
      );
      console.error(error);
      setError(error.message);
    }
  };
  // ----------------------------------------------
  const withdraw = async () => {
    const handler = pool.chain && await getHandler(pool.chain);

    try {
      await chainFactory.withdrawLiqiduity(
        // @ts-ignore
        handler,
        signer,
        pool.token,
        // @ts-ignore
        pool.amount * 10 ** TOKEN_DECIMALS[pool.token],
        undefined,
      );
    } catch (error: { message: string } | any) {
      // For TON
      await chainFactory.withdrawLiqiduity(
        // @ts-ignore
        handler,
        tonSender,
        pool.token,
        // @ts-ignore
        pool.amount * 10 ** TOKEN_DECIMALS[pool.token],
        undefined,
      );
      console.error(error);
      setError(error.message);
    }
  };
  // ----------------------------------------------
  const withdrawFees = async () => {
    const handler = pool.chain && await getHandler(pool.chain);

    try {
      await chainFactory.withdrawFees(
        // @ts-ignore
        handler,
        signer,
        pool.token,
        undefined,
      );
    } catch (error: { message: string } | any) {
      // For TON
      await chainFactory.withdrawFees(
        // @ts-ignore
        handler,
        tonSender,
        pool.token,
        undefined,
      );
      console.error(error);
      setError(error.message);
    }
  };
  // ----------------------------------------------
  const getBalance = async (
    type: "Deposit" | "Withdraw",
    chain: string,
    token: string,
    account: string
  ) => {

    try {
      const handler = pool.chain && await getHandler(chain);

      if (handler) {
        const _chain = SUPPORTED_CHAINS[ChainNameToTypeChainName[chain]];

        //  Get & return coint balance
        if (token === _chain.nativeCurrency.symbol && type === "Deposit") {
          return (
            Number(await handler.balance(account)) /
            10 ** TOKEN_DECIMALS[token as TTokenName]
          );
        }

        // Get & return Token balance
        if ("address" in handler) {
          if (type === "Deposit") {
            const tokenAddress = await handler.address(token as AddressBookKeys);

            return (
              Number(await handler.tokenBalance(tokenAddress, account)) /
              10 ** Number(TOKEN_DECIMALS[token as TTokenName])
            );
          } else { // Withdraw
            const tokenAddress = await handler.address(
              `elp${token}` as AddressBookKeys,
            );
            return (
              Number(await handler.tokenBalance(tokenAddress, account)) /
              10 ** Number(TOKEN_DECIMALS[token as TTokenName])
            );
          }
        }
      }

      return 0;
      
    } catch (error: { message: string } | any) {
      console.error(error);
      setError(error.message);
    }
  };
  // ----------------------------------------------
  useEffect(() => {
    let interval: NodeJS.Timeout;

    const fetchData = async () => {
      try {
        // Start the spinner
        setIsLoadingBalance(true);

        await sleep(1000);

        const balance = await getBalance(
          "Deposit",
          pool.chain,
          pool.token,
          bridge.senderAddress
        );

        if(balance !== undefined){
          dispatch(setPoolBalance(balance));
        }

        await sleep(1000);

        const stakedBalance = await getBalance(
          "Withdraw",
          pool.chain,
          pool.token,
          bridge.senderAddress
        );
        if(stakedBalance !== undefined){
          dispatch(setPoolStakedBalance(stakedBalance));
        }

        // Stop the spinner
        setIsLoadingBalance(false);
      } catch (error) {
        console.error("Error fetching balance:", error);
        clearInterval(interval);
      }
    };

    (async () => {

      if (
        isPoolPath
        && pool.chain
        && pool.token
        && bridge.senderAddress
        && await isValidAddress(pool.chain, bridge.senderAddress)
      ) {
        await fetchData();
        interval = setInterval(fetchData, 60_000);
      }
    })();

    return () => clearInterval(interval);
  }, [pool.chain, pool.token, bridge.senderAddress]);
  // ----------------------------------------------
  return {
    error,
    isLoadingBalance,
    stake,
    withdraw,
    getBalance,
    withdrawFees,
  };
}
