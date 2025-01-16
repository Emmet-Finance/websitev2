import { useEffect, useState } from "react";
import { useAppSelector } from "./storage";
import { Transaction } from "emmet.js/dist/factory/types";
import { CrossChainTransaction } from "@emmet-contracts/web3/dist/contracts/consensus/Consensus";
import { ccmHashByOriginalHash, getConsensus, ReceiveParams, getTransaction } from "emmet.js";

export default function useCircleTxData() {

  const bridge = useAppSelector((state) => state.bridge);

  function convertCCTStructToTx(
    cctStruct: CrossChainTransaction.CCTStructOutput & { decoded?: ReceiveParams },
  ): Transaction {

    const tx: Transaction = {
      txHash: cctStruct.txHash,
      sentAmount: cctStruct.decoded?.sentAmount,
      receivedAmount: cctStruct.decoded?.receiveAmount,
      fromToken: cctStruct.decoded?.fromToken,
      toToken: cctStruct.decoded?.toToken,
      originalHash: cctStruct.originalHash,
      destinationHash: cctStruct.destinationHash,
      started: cctStruct.started,
      finished: cctStruct.finished,
      recipient: cctStruct.decoded?.to,
    } as Transaction;

    return tx;
  }

  const initData = {
    txHash: "",
    sentAmount: BigInt(0),
    receivedAmount: BigInt(0),
    fromToken: "",
    toToken: "",
    destinationHash: "",
    originalHash: "",
    fromChainId: BigInt(0),
    toChainId: BigInt(0),
    nonce: BigInt(0),
    recipient: "",
    finished: BigInt(0),
    started: BigInt(Date.now()),
  } as Transaction;

  const [txData, setTxData] = useState<Transaction>(initData);
  const [hash, setHash] = useState(bridge.fromHash);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  let interval: string | number | NodeJS.Timeout | undefined;

  async function fetchData() {
    setIsError(false);
    setIsLoading(true);

    try {

      if (hash) {

        const consensus = await getConsensus();

        const ccmHash: string = await ccmHashByOriginalHash(consensus, hash, 100n);

        const ccmTX: CrossChainTransaction.CCTStructOutput & { decoded?: ReceiveParams } = await getTransaction(consensus, ccmHash);

        if (ccmTX) {
          setTxData(convertCCTStructToTx(ccmTX));
        }
      }
    } catch (error) {
      setIsError(true);
      console.error(error);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (bridge.toHash.length === 0) {

      interval = setInterval(() => {
        fetchData();
      }, 6_000);

      return () => clearInterval(interval);
    }

  }, [bridge.fromHash, bridge.toHash]);

  return [{ txData, isLoading, isError }, setHash];
}
