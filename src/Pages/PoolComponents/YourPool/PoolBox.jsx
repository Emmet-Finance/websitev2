import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAccount } from "wagmi";
import Skeleton from "../../CommonComponents/Skeleton/Skeleton";
import Target from "../../../assets/img/target.svg";
// Images
import BSC from "../../../assets/img/bsc.svg"
import ETH from "../../../assets/img/coin/eth.svg";
import Polygon from "../../../assets/img/coin/polygon.svg";
import TON from "../../../assets/img/ton.svg";
import USDT from "../../../assets/img/coin/usdt.svg";
import usePoolData from "../../../hooks/usePoolData";
import usePool from "../../../hooks/usePool";

const CHAIN_LOGOS = {
    BSC,
    Polygon,
    TON,
}

const TOKEN_LOGOS = {
    TON,
    USDT
}

export default function PoolBox({ chainName, tokenName }) {
    const { getBalance } = usePool();
    const { getData } = usePoolData();
    const { address, isConnected } = useAccount();
    const [data, setData] = useState({
        decimals: 1,
        apy: 0,
        totalSupply: 0,
        protocolFee: 0,
        protocolFeeAmount: 0,
        tokenFee: 0,
        feeGrowthGlobal: 0,
        feeDecimals: 0,
        pendingRewards: 0,
    });
    const [stakedBalance, setStakedBalance] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        (async () => {
            setLoading(true);
            const _data = isConnected && await getData(chainName, tokenName, address);
            isConnected && setData(_data);
            const _stakedBalance = isConnected
                ? await getBalance(
                    "Withdraw",
                    chainName,
                    tokenName,
                    address,
                )
                : 0;
                _stakedBalance && setStakedBalance(_stakedBalance);
            setLoading(false);
        })();
    }, [address]);

    return (
        <div className="poolBox">
            <div className="poolboxTop">
                <div className="poolboxTopLeft">
                    <div className="chainToken">
                        <img src={TOKEN_LOGOS[tokenName]} alt={`${TOKEN_LOGOS[tokenName]}`} className="mainChain" />
                        <img src={CHAIN_LOGOS[chainName]} alt={`${CHAIN_LOGOS[chainName]}`} className="onChain" />
                    </div>
                    <div className="">
                        <h2>{tokenName}</h2>
                        on {chainName}
                    </div>
                </div>
                <div className="poolboxTopRight">
                    <Link to="./your-liquidity" className="tragetLink">
                        <img src={Target} alt="Target" />
                    </Link>
                    <p>
                        {loading ? (
                            <Skeleton height={16} width={50} />
                        ) : (
                            <>
                                <b>APY</b> {data?.apy}%
                            </>
                        )}
                    </p>
                </div>
            </div>
            <div className="poolboxBottom">
                <div className="row">
                    <div className="col-6">
                        <h4>Deposit</h4>
                        <h3>
                            {loading ? (
                                <Skeleton height={20} width={80} />
                            ) : (
                                `$${stakedBalance}`
                            )}
                        </h3>
                    </div>
                    <div className="col-6">
                        <h4>Rewards</h4>
                        <h3>
                            {address ? (
                                loading ? (
                                    <Skeleton height={20} width={80} />
                                ) : (
                                    `$${data.pendingRewards}`
                                )
                            ) : (
                                "---"
                            )}
                        </h3>
                    </div>
                </div>
            </div>
        </div>
    );
}