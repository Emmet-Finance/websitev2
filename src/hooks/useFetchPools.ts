import {setPools, setPositions, TPool} from "../store/poolsSlice";
import { useAppDispatch, useAppSelector } from "./storage";
import { useEthersSigner } from "./useEthersSigner";
import { useTonConnect } from "./useTonConnect";
import { getData, getPositions } from "../utils/emmetjs";
import SUPPORTED_POOLS from "../data/pools.json";
import { useEffect, useState } from "react";
import { sleep } from "../utils";

export default function useFetchPools() {

    const dispatch = useAppDispatch();
    const evmSigner = useEthersSigner();
    const { sender: tonSender } = useTonConnect();

    const isTon = (chain:string) => chain.toLowerCase() === "ton";

    async function fetchPools(): Promise<void> {

        let pools: TPool[] = [];

        for await (const pool of SUPPORTED_POOLS){

            const address = isTon(pool.chain) 
                ? tonSender.address?.toString() 
                : evmSigner?.address;

            const tempPool = await getData(pool.chain, pool.token, address);

            if(tempPool){
                pools.push({
                    apy: tempPool.apy ? Number(tempPool.apy) : 0,
                    chain: pool.chain,
                    decimals: tempPool.decimals,
                    token: pool.token,
                    supply: tempPool.totalSupply,
                    rewards: tempPool.pendingRewards
                });
                await sleep(1000); // Let RPC cool down
            }
        }

        if(pools){dispatch(setPools(pools));}
        
    }

    useEffect(() => {
        let interval: NodeJS.Timeout;

        (async () => {

            await fetchPools();

            interval = setInterval(fetchPools, 60_000);

        })()

        return () => clearInterval(interval);
    },);

}