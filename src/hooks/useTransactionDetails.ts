import { useEffect, useState } from "react";
import { chainFactory } from "../store/chainFactory";
import { useAppDispatch } from "./storage";
import {
  setBridgeTransaction,
  DetailedTx as _DetailedTx,
} from "../store/explorerSlice";
import { DetailedTx } from "emmet.js/dist/factory/types";

/**
 * Requests for data by a bridge TX
 * @param hash
 * @returns DetailedTx | {} in a promise
 */
const fetchData = async (emmetHash: string): Promise<DetailedTx | {}> => {
  try {
    const data = await chainFactory.getTransaction(emmetHash);
    console.log('TX data:', data)
    return data;
  } catch (error: any) {
    console.warn(`useGetBridgeTx:fetchData:Error: ${error.message}`);
    return {};
  }
};

/**
 * HOOK: Retrievs a Bridge TX data
 * @param emmetHash - bridge transaction hash
 * @returns Transaction data or {}
 */
export default function useTransactionDetails(emmetHash: string) {
  const [data, setData] = useState<_DetailedTx | {}>();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (emmetHash) {
      (async () => {
        const _data: DetailedTx = await fetchData(emmetHash) as DetailedTx;
        if ("nonce" in _data) {
          const __data = {
            txHash: _data.txHash,
            nonce: Number(_data.nonce),
            sentAmount: Number(_data.sentAmount),
            receivedAmount: Number(_data.receivedAmount),
            fromChainId: Number(_data.fromChainId),
            toChainId: Number(_data.toChainId),
            fromToken: _data.fromToken,
            toToken: _data.toToken,
            recipient: _data.recipient,
            originalHash: _data.originalHash,
            destinationHash: _data.destinationHash,
            started: Number(_data.started),
            finished: Number(_data.finished),
            fromChainTimestamp: Number(_data.fromChainTimestamp),
            targetChainTimestamp: Number(_data.targetChainTimestamp),
            fromChainFees: Number(_data.fromChainFees),
            targetChainFees: Number(_data.targetChainFees),
            protocolFee: Number(_data.protocolFee),
          };
          setData(__data);
          dispatch(setBridgeTransaction(__data));
        }
      })();
    }
  }, [emmetHash]);

  return data;
}
