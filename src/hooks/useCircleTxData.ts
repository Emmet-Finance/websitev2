import { useEffect, useState } from "react";
import { setBridgeToHash } from '../store/bridgeSlice';
import { useAppSelector, useAppDispatch } from './storage';

export type TxDetails = {
    amount: number, // number of transferred tokens
    bridgeHash:string,
    burnToken: string, // the address of the transferred token
    mintRecipient: string, // Receiver address
    destinationDomain: number, // Number 0-7, Ethereum == 0, Polygon == 7
    // Additional params
    originalDomain: number,
    sender: string,
    burnHash: string,
    start: Date,
    claimHash?: string, // Will arrive when the token is claimed
    finished?: Date
}

export default function useCircleTxData() {

    console.log("useCircleTxData is triggered")

    const bridge = useAppSelector((state) => state.bridge);
    const dispatch = useAppDispatch();

    const initData = {
        amount: 0,
        bridgeHash: "",
        burnToken: '',
        mintRecipient: bridge.receiver,
        destinationDomain: -1,
        originalDomain: -1,
        sender:'',
        burnHash: bridge.fromHash,
        start: new Date(),
        claimHash: '',
        finished: new Date()
    }

    const [txData, setTxData] = useState<TxDetails>(initData);
    const [hash, setHash] = useState(bridge.fromHash);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);

    useEffect(() => {

        async function fetchData() {

            setIsError(false);
            setIsLoading(true);

            try {
                console.log("useCircleTxData:fetchingData")
                const result:Response = await fetch(`http://localhost:5000/hash/?hash=${hash}`);
                const CircleTXData: TxDetails = await result.json();
                console.log("CircleTXData:", CircleTXData)
                setTxData(CircleTXData);

                if(CircleTXData && CircleTXData.claimHash){
                    dispatch(setBridgeToHash(CircleTXData.claimHash))
                }
                
            } catch (error) {
                setIsError(true);
                console.error(error);
                setIsLoading(false);
            }

        }

        if(hash){

            if(bridge.fromHash == ''){
                setTimeout(() => {
                    fetchData();
                },30_000)
            }
        }

    });

    return [{ txData, isLoading, isError }, setHash];

}