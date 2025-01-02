import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "./storage";
import { useLocation } from 'react-router-dom';
import { chainFactory } from "../store/chainFactory";
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
import {
    ChainNameToTypeChainName,
    ChainToDestinationDomain,
  } from "../types";

export default function usePoolData() {

    const dispatch = useAppDispatch();

    const pool = useAppSelector((state) => state.pool);
    const bridge = useAppSelector((state) => state.bridge);

    const location = useLocation();
    const isPoolPath = location.pathname.includes('/pool');

    const [error, setError] = useState("");

    const getData = async (
        chain = pool.chain,
        token = pool.token,
        senderAddress = bridge.senderAddress,
    ) => {

        try {
            const handler = await chainFactory.inner(
                // @ts-ignore
                ChainToDestinationDomain[ChainNameToTypeChainName[chain]],
            );

            if ("address" in handler) {
                const poolAddress = await handler.address(`elp${token}`);

                const decimals = await handler.decimals(poolAddress).catch(() => 1);

                const totalSupply = await handler
                    .getLpTotalSupply(poolAddress)
                    .catch(() => 0n);

                const apy = await handler
                    .getLpCurrentAPY(poolAddress)
                    .catch(() => 0n);

                const protocolFee = await handler
                    .getLpProtocolFee(poolAddress)
                    .catch(() => 0n);

                const protocolFeeAmount = await handler
                    .getLpProtocolFeeAmount(poolAddress)
                    .catch(() => 0n);

                const tokenFee = await handler
                    .getLpTokenFee(poolAddress)
                    .catch(() => 0n);

                const feeGrowthGlobal = await handler
                    .getLpFeeGrowthGlobal(poolAddress)
                    .catch(() => 0n);

                const feeDecimals = await handler
                    .getLpFeeDecimals(poolAddress)
                    .catch(() => 0n);

                const validAddress = await handler.validateAddress(senderAddress);

                const pendingRewards = await handler
                    .getLpProviderRewards(poolAddress, senderAddress)
                    .catch(() => 0n);

                const tokenPrice = await chainFactory.getTokenPrice(token);

                const tokenPriceDecimals =
                    await chainFactory.getPriceDecimals(token);

                const liquidityPoolInUSD =
                    Number(totalSupply * tokenPrice) /
                    10 ** (decimals + Number(tokenPriceDecimals));

                return {
                    decimals,
                    apy: Number(apy) / 100,
                    totalSupply: Number(totalSupply) / 10 ** decimals,
                    protocolFee: Number(protocolFee),
                    protocolFeeAmount: Number(protocolFeeAmount),
                    tokenFee: Number(tokenFee),
                    feeGrowthGlobal: Number(feeGrowthGlobal) / 10 ** decimals,
                    feeDecimals: Number(feeDecimals),
                    pendingRewards: validAddress
                        ? Number(pendingRewards) / 10 ** decimals
                        : 0,
                    liquidityPoolInUSD: Number(liquidityPoolInUSD).toFixed(2),
                };
            }
        } catch (error: { message: string } | any) {
            setError(error.message);
            console.error(error);
            return {
                decimals: 1,
                apy: 0,
                totalSupply: 0,
                protocolFee: 0,
                protocolFeeAmount: 0,
                tokenFee: 0,
                feeGrowthGlobal: 0,
                feeDecimals: 0,
                pendingRewards: 0,
                liquidityPoolInUSD: 0,
            };
        }
    };

    const fetchPoolData = async () => {
        dispatch(setPoolDataLoading(true));

        const data = await getData(
            pool.chain,
            pool.token,
            bridge.senderAddress,
        );

        if (data) {
            dispatch(setPoolApy(data.apy));
            dispatch(setPoolTotalSupply(data.totalSupply));
            dispatch(setPoolProtocolFee(data.protocolFee));
            dispatch(setPoolProtocolFeeAmount(data.protocolFeeAmount));
            dispatch(setPoolTokenFee(data.tokenFee));
            dispatch(setPoolFeeGrowthGlobal(data.feeGrowthGlobal));
            dispatch(setPoolFeeDecimals(data.feeDecimals));
            dispatch(setPoolPendingRewards(data.pendingRewards));
            dispatch(setPoolLiquidityInUSD(data.liquidityPoolInUSD));
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
        error,
        getData
    }

}