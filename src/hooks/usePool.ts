import { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from "./storage";
import {
  ChainNameToTypeChainName,
  ChainToDestinationDomain,
  SUPPORTED_CHAINS,
  TChainName,
  TOKEN_DECIMALS,
  TTokenName,
} from "../types";
import { chainFactory } from "../store/chainFactory";
import { useEthersSigner } from "./useEthersSigner";
import {
  setPoolBalance,
  setPoolStakedBalance,
} from "../store/poolSlice";
import { AddressBookKeys } from "emmet.js";
import { useTonConnect } from "./useTonConnect";
import { sleep } from "../utils";

export default function usePool() {

  const location = useLocation();

  const isPoolPath = location.pathname.includes('/pool');

  const dispatch = useAppDispatch();

  const signer = useEthersSigner();
  const { sender: tonSender } = useTonConnect();

  const pool = useAppSelector((state) => state.pool);
  const bridge = useAppSelector((state) => state.bridge);

  const [error, setError] = useState("");
  const [isLoadingBalance, setIsLoadingBalance] = useState<boolean>(false);

  const stake = async () => {
    const handler = await chainFactory.inner(
      // @ts-ignore
      ChainToDestinationDomain[ChainNameToTypeChainName[pool.chain]],
    );
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

  const withdraw = async () => {
    const handler = await chainFactory.inner(
      // @ts-ignore
      ChainToDestinationDomain[ChainNameToTypeChainName[pool.chain]],
    );
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

  const withdrawFees = async () => {
    const handler = await chainFactory.inner(
      // @ts-ignore
      ChainToDestinationDomain[ChainNameToTypeChainName[pool.chain]],
    );
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

  const getBalance = async (
    type: "Deposit" | "Withdraw",
    chain = pool.chain,
    token = pool.token,
    address = bridge.senderAddress,
  ) => {
    await sleep(10000);
    try {
      const handler = await chainFactory.inner(
        // @ts-ignore
        ChainToDestinationDomain[ChainNameToTypeChainName[chain as TChainName]],
      );
      const _chain = SUPPORTED_CHAINS[ChainNameToTypeChainName[pool.chain]];
      if (token === _chain.nativeCurrency.symbol && type === "Deposit") {
        return (
          Number(await handler.balance(address)) /
          10 ** TOKEN_DECIMALS[token as TTokenName]
        );
      }
      if ("address" in handler) {
        if (type === "Deposit") {
          const tokenAddress = await handler.address(token as AddressBookKeys);

          return (
            Number(await handler.tokenBalance(tokenAddress, address)) /
            10 ** Number(TOKEN_DECIMALS[token as TTokenName])
          );
        } else { // Withdraw
          const tokenAddress = await handler.address(
            `elp${token}` as AddressBookKeys,
          );
          return (
            Number(await handler.tokenBalance(tokenAddress, address)) /
            10 ** Number(TOKEN_DECIMALS[token as TTokenName])
          );
        }
      }
      return 0;
    } catch (error: { message: string } | any) {
      console.error(error);
      setError(error.message);
      return 0;
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const fetchData = async () => {
      try {
        // Start the spinner
        setIsLoadingBalance(true);
  
        const balance = await getBalance(
          "Deposit",
          pool.chain,
          pool.token,
          bridge.senderAddress,
        );
        dispatch(setPoolBalance(balance));
  
        const stakedBalance = await getBalance(
          "Withdraw",
          pool.chain,
          pool.token,
          bridge.senderAddress,
        );
        dispatch(setPoolStakedBalance(stakedBalance));
  
        // Stop the spinner
        setIsLoadingBalance(false);
      } catch (error) {
        console.error("Error fetching balance:", error);
        clearInterval(interval);
      }
    };



    (async () => {
      
      if (pool.chain && pool.token && isPoolPath) {
        if (bridge.senderAddress) {
          interval = setInterval(fetchData, 60_000);
        }
      }
    })();

    return () => clearInterval(interval);
  }, [pool.chain, pool.token, bridge.senderAddress]);

  return {
    error,
    isLoadingBalance,
    stake,
    withdraw,
    getBalance,
    withdrawFees,
  };
}
