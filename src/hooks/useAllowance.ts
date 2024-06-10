import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { erc20Abi } from "viem";
import { useAppSelector, useAppDispatch } from "./storage";
import { getProvider, getTokenAddress, addressToAccount } from "../utils";
import {
  ChainNameToTypeChainName,
  ChainToDestinationDomain,
  SUPPORTED_CHAINS,
  TChainName,
  TTokenName,
} from "../types";
import {
  setBridgeAllowance,
  setBridgeDecimals,
  setBridgeError,
} from "../store/bridgeSlice";
import { chainFactoryTestnet } from "../store/chainFactory";
import { Web3Helper } from "emmet.js/dist/chains/web3";

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
      Number(bridge.allowance) / 10 ** Number(bridge.decimals)
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
        const handler = await chainFactoryTestnet.inner(
          // @ts-ignore
          ChainToDestinationDomain[ChainNameToTypeChainName[bridge.fromChain]],
        );

        const tokenAddress = (
          await (handler as Web3Helper).token(bridge.fromToken)
        ).address;
        const chainName: TChainName =
          ChainNameToTypeChainName[bridge.fromChain];
        const chain = SUPPORTED_CHAINS[chainName];
        const spender: string = chain!.emmetBridge.address;
        const provider = getProvider(chainName);

        if (tokenAddress) {
          const decimals = await provider.readContract({
            // @ts-ignore
            address: tokenAddress,
            abi: erc20Abi,
            functionName: "decimals",
          });

          setDecimals(BigInt(decimals));
          dispatch(setBridgeDecimals(decimals));

          // const allowance = await provider.readContract({
          //   address: tokenAddress,
          //   abi: erc20Abi,
          //   functionName: "allowance",
          //   args: [addressToAccount(address!), addressToAccount(spender)],
          // });

          if ("getApprovedAmount" in handler) {
            const allowance = await handler.getApprovedAmount(
              tokenAddress,
              bridge.senderAddress,
            );
            setAllowance(Number(allowance.toString()));
            console.log({ allowance: Number(allowance.toString()) });
            dispatch(setBridgeAllowance(Number(allowance.toString())));
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
