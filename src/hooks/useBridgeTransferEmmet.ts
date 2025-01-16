import { useState } from "react";
import { parseEther } from "viem";
import { useAppDispatch, useAppSelector } from "./storage";
import { setBridgeFromHash, showBridgeProgress } from "../store/bridgeSlice";
import {
  TChainName,
  ChainNameToTypeChainName,
  ChainToDestinationDomain,
  TOKEN_DECIMALS,
  CHAIN_NAME_TO_ID,
} from "../types";
import { useTonConnect } from "./useTonConnect";
import { Chain, CHAIN_NAME_TO_INNER_ID } from "emmet.js/dist/factory/types";
import { chainFactory } from "../store/chainFactory";
import { useEthersSigner } from "./useEthersSigner";
import useBridgeFee from "./useBridgeFee";
import { TonHelper } from "emmet.js/dist/chains/ton";
import { Web3Helper } from "emmet.js/dist/chains";
// import { ErrorDecoder } from "ethers-decode-error";
// import { EmmetBridge__factory } from "@emmet-contracts/web3";

export default function useBridgeTransferEmmet() {
  const { sender: tonSender } = useTonConnect();
  const { fee, nativeCurrency, formattedFee, protocolFee, protocolFeeInUSD } = useBridgeFee();

  const dispatch = useAppDispatch();

  const signer = useEthersSigner();

  const bridge = useAppSelector((state) => state.bridge);

  const [isTransferProcessed, setIsTransferProcessed] =
    useState<boolean>(false);

  const [error, setError] = useState("");

  const sendInstallment = () => {
    setError("");
    setIsTransferProcessed(true);
    (async () => {
      const chainName: TChainName = ChainNameToTypeChainName[bridge.fromChain];
      const formattedAmount =
        Number(bridge.amount) *
        10 ** TOKEN_DECIMALS[bridge.fromToken as keyof typeof TOKEN_DECIMALS];
      const destinationDomain =
        ChainToDestinationDomain[ChainNameToTypeChainName[bridge.toChain]];
      const mintRecipient = bridge.receiver;

      const isPolygon: boolean = bridge.fromChain.toLowerCase() === 'polygon'
        || bridge.fromChain.toLowerCase() === 'polygonamoy';

      try {
        const fromChainID = ChainToDestinationDomain[chainName];

        // S e n d i n g   t o   T O N
        if (fromChainID === Chain.TON) {
          const handler: TonHelper = (await chainFactory.inner(
            fromChainID,
          )) as TonHelper;

          console.log({
            handler,
            tonSender,
            amount: BigInt(Math.ceil(formattedAmount)),
            destinationDomain,
            fromToken: bridge.fromToken,
            toToken: bridge.toToken,
            mintRecipient,
            formattedFee,
            fee,
          });

          const { hash } = await chainFactory.sendInstallment(
            handler,
            tonSender,
            BigInt(Math.ceil(formattedAmount)),
            destinationDomain,
            bridge.fromToken,
            bridge.toToken,
            mintRecipient,
          );

          dispatch(setBridgeFromHash(hash ? hash : "N/A"));
          dispatch(showBridgeProgress());
          setIsTransferProcessed(false);
        } else if ( // S e n d i n g   t o   E V M s
          fromChainID === Chain.AVALANCHE ||
          fromChainID === Chain.POLYGON ||
          fromChainID === Chain.ETHEREUM ||
          fromChainID === Chain.BSC ||
          fromChainID === Chain.BERACHAIN ||
          fromChainID === Chain.ONLYLAYER
        ) {
          const handler: Web3Helper = (await chainFactory.inner(
            fromChainID,
          )) as Web3Helper;

          console.log("PARAMS:", {
            // handler,
            // signer,
            amount: BigInt(Math.ceil(formattedAmount)),
            destinationDomain,
            fromToken: bridge.fromToken,
            toToken: bridge.toToken,
            mintRecipient,
            gas: {
              value: isPolygon
                ? fee ? BigInt(fee + 1e17) : parseEther("1.2")
                : fee ? BigInt(fee + 1e15) : parseEther("0.1")
            },
            protocolFeeInUSD,
            protocolFee,
            fee,
            isPolygon
          });

          const { hash } = await chainFactory.sendInstallment(
            handler,
            signer!,
            BigInt(Math.ceil(formattedAmount)),
            destinationDomain,
            bridge.fromToken,
            bridge.toToken,
            mintRecipient,
            {
              // value: isPolygon
              // ? fee ? BigInt(fee + 1e17) : parseEther("1.2")
              // : fee ? BigInt(fee + 1e15) : parseEther("0.1")
              value: parseEther("1.2")
            },
          );

          dispatch(setBridgeFromHash(hash ? hash : "N/A"));
          dispatch(showBridgeProgress());
          setIsTransferProcessed(false);
        }
      } catch (error: { message: string } | any) {
        console.error(error);
        setIsTransferProcessed(false);
      }
    })().catch((e: { message: string }) => {
      console.error(
        "useBridgeTransferEmmet => sendInstallment => Error:",
        e.message,
      );
      setError(e.message);
      setIsTransferProcessed(false);
    });
  };

  return { error, isTransferProcessed, sendInstallment };
}
