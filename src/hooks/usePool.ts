import { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import { AddressBookKeys, sleep, TonHelper, Web3Helper } from "emmet.js";
import { useAppDispatch, useAppSelector } from "./storage";
import {
  ChainNameToTypeChainName,
  ChainToDestinationDomain,
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

  const isPoolPath = location.pathname.includes('/your-liquidity');
  // ----------------------------------------------
  const getHandler = async (): Promise<Web3Helper | TonHelper> => {
    const handler = await chainFactory.inner(
      // @ts-ignore
      ChainToDestinationDomain[ChainNameToTypeChainName[pool.chain]],
    );
    return handler;
  }
  // ----------------------------------------------
  const isValidAddress = async (address: string): Promise<boolean> => {
    const handler: Web3Helper | TonHelper = await getHandler();
    const validAddress: boolean = await handler.validateAddress(bridge.senderAddress);
    return validAddress;
  }
  // ----------------------------------------------
  const stake = async () => {
    const handler = await getHandler();

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
    const handler = await getHandler();

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
    const handler = await getHandler();

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
  ) => {

    try {
      const handler = await getHandler();

      const _chain = SUPPORTED_CHAINS[ChainNameToTypeChainName[pool.chain]];

      //  Get & return coint balance
      if (pool.token === _chain.nativeCurrency.symbol && type === "Deposit") {
        return (
          Number(await handler.balance(bridge.senderAddress)) /
          10 ** TOKEN_DECIMALS[pool.token as TTokenName]
        );
      }

      // Get & return Token balance
      if ("address" in handler) {
        if (type === "Deposit") {
          const tokenAddress = await handler.address(pool.token as AddressBookKeys);

          return (
            Number(await handler.tokenBalance(tokenAddress, bridge.senderAddress)) /
            10 ** Number(TOKEN_DECIMALS[pool.token as TTokenName])
          );
        } else { // Withdraw
          const tokenAddress = await handler.address(
            `elp${pool.token}` as AddressBookKeys,
          );
          return (
            Number(await handler.tokenBalance(tokenAddress, bridge.senderAddress)) /
            10 ** Number(TOKEN_DECIMALS[pool.token as TTokenName])
          );
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
        );
        dispatch(setPoolBalance(balance ? balance : 0));

        await sleep(1000);

        const stakedBalance = await getBalance(
          "Withdraw",
        );
        dispatch(setPoolStakedBalance(stakedBalance ? stakedBalance : 0));

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
        && await isValidAddress(bridge.senderAddress)
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
