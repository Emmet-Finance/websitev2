import { setPositions, TPosition} from "../store/poolsSlice";
import { useAppDispatch } from "./storage";
import { useEthersSigner } from "./useEthersSigner";
import { useTonConnect } from "./useTonConnect";
import { getPositions } from "../utils/emmetjs";
import SUPPORTED_POOLS from "../data/pools.json";
import { useEffect } from "react";

export default function useFetchPositions() {

    const dispatch = useAppDispatch();
    const evmSigner = useEthersSigner();
    const { sender: tonSender } = useTonConnect();

    const isTon = (chain:string) => chain.toLowerCase() === "ton";

    async function fetchPositions(): Promise<void> {

        let positions: TPosition[] = [];

        for await (const pool of SUPPORTED_POOLS){

            const address: string = isTon(pool.chain) 
                ? tonSender.address?.toString() as string
                : evmSigner?.address as string;

            const tempPos = await getPositions(pool.chain, pool.token, address);
            // console.log("tempPos", tempPos, "pool.chain", pool.chain, "pool.token", pool.token, "address", address)

            if(tempPos && tempPos.balance && tempPos.rewards){
                
                positions.push({
                    chain: pool.chain,
                    token: pool.token,
                    balance: Number(tempPos.balance.toString()),
                    rewards: Number(tempPos.rewards.toString())
                });
            }
        }

        if(positions){dispatch(setPositions(positions));}
        
    }

    useEffect(() => {
        let interval: NodeJS.Timeout;

        (async () => {

            await fetchPositions();

            interval = setInterval(fetchPositions, 60_000);

        })()

        return () => clearInterval(interval);
    },);

}