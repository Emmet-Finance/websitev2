import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./storage";
import { useLocation } from 'react-router-dom';
import {
    setPoolApy,
    setPoolDataLoading,
    setPoolFeeDecimals,
    setPoolFeeGrowthGlobal,
    setPoolLiquidityInUSD,
    setPoolPendingRewards,
    setPoolProtocolFee,
    setPoolProtocolFeeAmount,
    setPoolTokenFee,
    setPoolTotalSupply,
} from "../store/poolSlice";
import { sleep } from "emmet.js";
import { useTonConnect } from "./useTonConnect";
import { getData, getPositions } from "../utils/emmetjs";


export default function usePoolData() {

    const dispatch = useAppDispatch();
    const { sender: tonSender } = useTonConnect();

    const pool = useAppSelector((state) => state.pool);
    const bridge = useAppSelector((state) => state.bridge);

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
            dispatch(setPoolApy(data.apy));
            dispatch(setPoolTotalSupply(data.totalSupply));
            dispatch(setPoolProtocolFee(data.protocolFee));
            dispatch(setPoolProtocolFeeAmount(data.protocolFeeAmount));
            dispatch(setPoolTokenFee(data.tokenFee));
            dispatch(setPoolFeeGrowthGlobal(data.feeGrowthGlobal));
            dispatch(setPoolFeeDecimals(data.feeDecimals));
            dispatch(setPoolPendingRewards(data.pendingRewards));
            dispatch(setPoolLiquidityInUSD(data.totalSupply
                // data.liquidityPoolInUSD
            ));
        }

        dispatch(setPoolDataLoading(false));
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
        getData,
        getPositions
    }

}