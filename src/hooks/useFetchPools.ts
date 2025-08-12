import { setPools, TPool } from "../store/poolsSlice";
import { useAppDispatch, useAppSelector } from "./storage";
import { useEthersSigner } from "./useEthersSigner";
import { useTonConnect } from "./useTonConnect";
import { getData } from "../utils/emmetjs";
import SUPPORTED_POOLS from "../data/pools.json";
import { useEffect } from "react";
import { sleep } from "../utils";

export default function useFetchPools() {

    const dispatch = useAppDispatch();
    const evmSigner = useEthersSigner();
    const { tonSender } = useTonConnect();

    const _pools = useAppSelector((state:any) => state.pools);

    const isTon = (chain: string) => chain.toLowerCase() === "ton";

    async function fetchPools(): Promise<void> {

        let pools: TPool[] = [];

        for await (const pool of SUPPORTED_POOLS) {

            if (isTon(pool.chain) && !tonSender.address) return;
            if (!isTon(pool.chain) && !evmSigner) return;

            const address = isTon(pool.chain)
                ? tonSender.address?.toString()
                : evmSigner?.address;


            try {
                // console.log(pool.chain, pool.token, address)
                const tempPool = await getData(pool.chain, pool.token, address);
                // console.log("useFetchPools::tempPool", pool.chain, tempPool)

                if (tempPool) {
                    const p: TPool = _pools.pools.find((p: TPool) => p.chain === pool.chain)
                    pools.push({
                        apy: tempPool.apy ? Number(tempPool.apy) : p?.apy ? p.apy : 0,
                        chain: pool.chain,
                        decimals: tempPool.decimals,
                        token: pool.token,
                        supply: pool.chain.toLowerCase() === 'polygon' ? tempPool.supply + 100_000 : tempPool.supply,
                        balance: tempPool.balance
                    });
                    await sleep(1000); // Let RPC cool down
                }
            } catch (error) {
                console.error(`Failed to fetch ${pool.chain}/${pool.token}`, error);
            }


        }

        if (pools) { dispatch(setPools(pools)); }
        await sleep(1000); // Let RPC cool down
    }

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if(evmSigner?.address || tonSender.address){
            (async () => {

                await fetchPools();
    
                interval = setInterval(fetchPools, 60_000);
    
            })()
    
            return () => clearInterval(interval);
        }
        
    }, [tonSender.address, evmSigner?.address]);

}