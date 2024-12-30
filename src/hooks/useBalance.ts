import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./storage";
import {
  setBridgeBalance,
  setBridgeError,
  setBridgeToBalance,
} from "../store/bridgeSlice";
import { chainFactory } from "../store/chainFactory";
import { Web3Helper } from "emmet.js/dist/chains/web3";
import { TChainName } from "emmet.js";
import { TonHelper } from "emmet.js/dist/chains/ton";
import {
  ChainNameToTypeChainName,
  SUPPORTED_CHAINS,
  TOKEN_DECIMALS,
  TTokenName,
  ChainToDestinationDomain,
  TDirection,
} from "../types";

const checkBalanceInterval: number = 6_000;

export default function useBalance() {

  const dispatch = useAppDispatch();
  const bridge = useAppSelector((state) => state.bridge);

  const [txFeeCoinBalance, setTxFeeCoinbalance] = useState<number>(0);
  const [balance, setBalance] = useState<number>(0);
  const [balanceTo, setBalanceTo] = useState<number>(0);
  const [isZeroBalance, setIsZeroBalance] = useState<boolean>(false);
  const [isZeroToBalance, setIsZeroToBalance] = useState<boolean>(false);

  async function getCoinBalance(direction: TDirection) {
    try {
      const handler =
        direction === "from"
          ? await chainFactory.inner(
            // @ts-ignore
            ChainToDestinationDomain[
            ChainNameToTypeChainName[bridge.fromChain]
            ],
          )
          : await chainFactory.inner(
            // @ts-ignore
            ChainToDestinationDomain[
            ChainNameToTypeChainName[bridge.toChain]
            ],
          );
      const addr =
        direction === "from" ? bridge.senderAddress : bridge.receiver;
      console.log("getCoinBalance: addr", addr)

      const bal = await handler?.balance(addr);

      return bal ? Number(bal) : 0;

    } catch (error) {
      // console.error("useBalance:getCoinBalance", error);
      return 0;
    }

  }

  async function getTokenBalance(direction: TDirection) {
    try {

      const addr = direction === "from"
        ? bridge.senderAddress
        : bridge.receiver;

      const chainName: string = direction === "from"
        ? bridge.fromChain
        : bridge.toChain;

      const tokenName: string = direction === "from"
        ? bridge.fromToken
        : bridge.toToken;

      const handler: Web3Helper | TonHelper = await chainFactory.inner(
        // @ts-ignore
        ChainToDestinationDomain[
        ChainNameToTypeChainName[chainName]
        ]
      );

      const tokenAddress: string = await handler.getTokenAddress(tokenName);

      const bal = await handler.tokenBalance(tokenAddress, addr);

      return Number(bal) || 0;

    } catch (error) {
      // console.error("useBalance:getTokenBalance", error);
      return 0;
    }

  }

  /**
   * Requests for coin | token balance
   * @param direction "from" | "to"
   * @param chain a Viem compatible chain class
   */
  async function readBalance(direction: TDirection, chainName: TChainName) {

    const chain = SUPPORTED_CHAINS[ChainNameToTypeChainName[chainName]];
    const tokenName: string = direction === "from" ? bridge.fromToken : bridge.toToken;

    const bal = tokenName === chain.nativeCurrency.symbol
      ? await getCoinBalance(direction)
      : await getTokenBalance(direction);

    const formattedBalance = bal / 10 ** TOKEN_DECIMALS[tokenName as TTokenName];

    if (direction === "from") {
      setIsZeroBalance(formattedBalance === 0 ? true : false);
      dispatch(setBridgeBalance(formattedBalance));
      setBalance(formattedBalance);
    } else {
      setIsZeroToBalance(formattedBalance === 0 ? true : false);
      dispatch(setBridgeToBalance(formattedBalance));
      setBalanceTo(formattedBalance);
    }

    dispatch(setBridgeError(""));

  }

  useEffect(() => {
    setBalance(0);
  }, [bridge.fromChain, bridge.fromToken, bridge.senderAddress]);

  useEffect(() => {
    setBalanceTo(0);
  }, [bridge.toToken, bridge.toChain, bridge.receiver]);

  useEffect(() => { // ORIGIN BALANCE
    const interval = setInterval(() => {
      const { fromChain, fromToken, senderAddress, isSwapping } = bridge;
      if(fromChain && fromToken && senderAddress && !isSwapping){
        readBalance("from", fromChain as TChainName)
        .catch(e => {
          const formattedError = `useCoinBalanceFrom:Error: ${e}`;
          dispatch(setBridgeError(formattedError));
        });
      } 
    }, checkBalanceInterval);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    bridge.fromChain,
    bridge.fromToken,
    bridge.toToken,
    bridge.senderAddress,
    bridge.isSwapping
  ]);

  useEffect(() => { // DESTINATION BALANCE
    const interval = setInterval(() => {
      const {receiver, toChain, toToken, isSwapping} = bridge;
    if(receiver && toChain && toToken && !isSwapping){
      readBalance("to", toChain as TChainName)
      .catch( e => {
        const formattedError = `useCoinBalanceTo:Error: ${e}`;
      dispatch(setBridgeError(formattedError));
      });
    }
    }, checkBalanceInterval);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    bridge.toChain,
    bridge.fromToken,
    bridge.toToken,
    bridge.receiver,
    bridge.isSwapping
  ]);

  return {
    coinBalance: txFeeCoinBalance,
    fromBalance: balance,
    toBalance: balanceTo,
    isZeroBalance,
    isZeroToBalance
  };
}
