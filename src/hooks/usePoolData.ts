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
import { sleep, TLPData, TLPPosition, TonHelper, Web3Helper } from "emmet.js";
import { useEthersSigner } from "./useEthersSigner";
import { useTonConnect } from "./useTonConnect";

export default function usePoolData() {

    const dispatch = useAppDispatch();
    const signer = useEthersSigner();
    const { sender: tonSender } = useTonConnect();

    const pool = useAppSelector((state) => state.pool);
    const bridge = useAppSelector((state) => state.bridge);

    const location = useLocation();
    const isPoolPath = location.pathname.includes('/pool');

    const [error, setError] = useState("");

    const getHandler = async (): Promise<Web3Helper | TonHelper> => {
        const handler = await chainFactory.inner(
            // @ts-ignore
            ChainToDestinationDomain[ChainNameToTypeChainName[pool.chain]],
        );
        return handler;
    }

    const isValidAddress = async (address: string): Promise<boolean> => {
        const handler: Web3Helper | TonHelper = await getHandler();
        const validAddress: boolean = await handler.validateAddress(bridge.senderAddress);
        return validAddress;
    }

    const getData = async () => {

        try {
            const handler = await getHandler();

            if ("address" in handler) {

                const data: TLPData = await handler.getLpData(`elp${pool.token}`);

                await sleep(1000); // let time to update the address

                const validAddress = await isValidAddress(bridge.senderAddress);

                let stakerPosition: TLPPosition = {} as TLPPosition;

                if (validAddress) {
                    stakerPosition = await handler.getPosition(`elp${pool.token}`, bridge.senderAddress);
                }


                // const tokenPrice: bigint = await chainFactory.getTokenPrice(token);
                // console.log("tokenPrice", tokenPrice)

                // const tokenPriceDecimals =
                //     await chainFactory.getPriceDecimals(token);
                //     console.log("tokenPriceDecimals", tokenPriceDecimals)

                // const liquidityPoolInUSD: bigint =
                //     data.total_supply * tokenPrice /
                //     10n ** (data.decimals + tokenPriceDecimals);

                const decimalAmount: bigint = 10n ** data.decimals;

                return {
                    decimals: Number(data.decimals),
                    apy: Number(data.apy) / 100,
                    totalSupply: Number(data.total_supply / decimalAmount),
                    protocolFee: Number(data.protocol_fee),
                    protocolFeeAmount: Number(data.protocol_fee_amount),
                    tokenFee: Number(data.token_fee),
                    feeGrowthGlobal: Number(data.fee_growth_global / decimalAmount),
                    feeDecimals: Number(data.fee_decimals),
                    pendingRewards: validAddress
                        ? (Number(stakerPosition.rewards) / Number(decimalAmount))
                        : 0,
                    liquidityPoolInUSD: 0n // Number(liquidityPoolInUSD).toFixed(2),
                };
            }
        } catch (error: { message: string } | any) {
            setError(error.message);
            console.error("usePoolData::getData:", error);
            await sleep(1000);
            return await getData()
        }
    };

    const getPositions = async (): Promise<TLPPosition> => {
        try {
            const handler = await getHandler();
            const validAddress = await isValidAddress(bridge.senderAddress);

            let stakerPosition: TLPPosition = {} as TLPPosition;

            if (validAddress) {
                stakerPosition = await handler.getPosition(`elp${pool.token}`, bridge.senderAddress);
            }

            return stakerPosition;
        } catch (error: { message: string } | any) {
            setError(error.message);
            console.error("usePoolData::getPositions:", error);
            await sleep(1000);
            return await getPositions()
        }
    }

    const fetchPoolData = async () => {
        dispatch(setPoolDataLoading(true));
        await sleep(1000);
        const data = await getData();

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
        error,
        getData,
        getPositions
    }

}