import { setPositions, TPosition} from "../store/poolsSlice";
import { useAppDispatch, useAppSelector } from "./storage";
import { useEthersSigner } from "./useEthersSigner";
import { useTonConnect } from "./useTonConnect";
import SUPPORTED_POOLS from "../data/pools.json";
import { useEffect, useState } from "react";
import { getSafeBalance } from "./shared";
import { sleep } from "emmet.js";

export default function useFetchPositions() {

    const dispatch = useAppDispatch();
    const evmSigner = useEthersSigner();
    const { tonSender } = useTonConnect();
    const currentPositions: TPosition[] = useAppSelector(state => state.pools.positions); // <- read last state
    const [error, setError] = useState("");

    const isTon = (chain:string) => chain.toLowerCase() === "ton";

    async function fetchPositions(): Promise<void> {

        let newPositions: TPosition[] = [];

        for await (const pool of SUPPORTED_POOLS){

            const address: string = isTon(pool.chain) 
                ? tonSender.address?.toString() as string
                : evmSigner?.address as string;

            const underlying = await getSafeBalance("Deposit", pool.chain, pool.token, address, setError);
            const lp = await getSafeBalance("Withdraw", pool.chain, pool.token, address, setError);

            const prev = currentPositions.find(
                (p) => p.chain === pool.chain && p.token === pool.token
              );
        
              newPositions.push({
                chain: pool.chain,
                token: pool.token,
                balance: underlying ?? prev?.balance ?? 0,
                staked: lp ?? prev?.staked ?? 0,
              });

            await sleep(1000);
        }

        if(newPositions.length){
            dispatch(setPositions(newPositions));
        }
        await sleep(1000);
        
    }

    useEffect(() => {
        let interval: NodeJS.Timeout;

        (async () => {

            await fetchPositions();

            interval = setInterval(fetchPositions, 60_000);

        })()

        return () => clearInterval(interval);
    },[tonSender.address, evmSigner?.address]);

}