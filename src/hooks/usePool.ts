import { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import { AddressBookKeys, sleep } from "emmet.js";
import { useAppDispatch, useAppSelector } from "./storage";
import {
  TOKEN_DECIMALS,
} from "../types";
import { chainFactory } from "../store/chainFactory";
import { useEthersSigner } from "./useEthersSigner";
import {
  setPoolBalance,
  setPoolStakedBalance,
} from "../store/poolSlice";
import { useTonConnect } from "./useTonConnect";
import { getHandler, isValidAddress } from "../utils/emmetjs";
import { getBalance } from "./shared";

export default function usePool() {

  // Hooks
  const location = useLocation();
  const dispatch = useAppDispatch();

  // Injected accounts
  const signer = useEthersSigner();
  const { tonSender } = useTonConnect();

  // State Slices
  const pool = useAppSelector((state:any) => state.pool);
  const bridge = useAppSelector((state:any) => state.bridge);

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
          bridge.senderAddress,
          setError,
        );

        if(balance !== undefined){
          dispatch(setPoolBalance(balance));
        }

        await sleep(1000);

        const stakedBalance = await getBalance(
          "Withdraw",
          pool.chain,
          pool.token,
          bridge.senderAddress,
          setError,
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
