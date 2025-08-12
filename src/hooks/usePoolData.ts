import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./storage";
import { useLocation } from 'react-router-dom';
import {
    setPoolApy,
    setPoolDataLoading,
    setPoolLiquidityInUSD,
    setPoolPendingRewards,
    setPoolTotalSupply,
} from "../store/poolSlice";
import { sleep } from "emmet.js";
import { useTonConnect } from "./useTonConnect";
import { getData } from "../utils/emmetjs";


export default function usePoolData() {

    const dispatch = useAppDispatch();
    const { tonSender } = useTonConnect();

    const pool = useAppSelector((state:any) => state.pool);
    const bridge = useAppSelector((state:any) => state.bridge);

    const location = useLocation();
    const isPoolPath = location.pathname.includes('/pool');

    const fetchPoolData = async () => {
        dispatch(setPoolDataLoading(true));
        await sleep(1000);
        let data;
        if(pool.chain.toLowerCase() === "ton"){
            data = await getData(pool.chain, pool.token, tonSender.address?.toString());
        }else {
            data = await getData(pool.chain, pool.token, bridge.senderAddress);
        }

        if (data) {
            data.apy && dispatch(setPoolApy(data.apy));
            data.supply && dispatch(setPoolTotalSupply(data.supply));
            data.balance && dispatch(setPoolPendingRewards(data.balance));
            data.liquidityPoolInUSD && dispatch(setPoolLiquidityInUSD(data.liquidityPoolInUSD.toString()));
        }

        dispatch(setPoolDataLoading(false));
        await sleep(1000);
    };

    useEffect(() => {
        let interval: NodeJS.Timeout;

        (async () => {

            if (pool.chain && pool.token && isPoolPath) {
                if (bridge.senderAddress) {
                    // Fetch data immediately
                    await fetchPoolData();

                    // Then fetch data every minute
                    interval = setInterval(fetchPoolData, 60_000);
                }
            }

        })();

        return () => clearInterval(interval);
    }, [pool.chain, pool.token, bridge.senderAddress]);

    return {
        getData
    }

}