import React from "react";
import { Link } from "react-router-dom";
// import { useAccount } from "wagmi";
import Skeleton from "../../CommonComponents/Skeleton/Skeleton";
import Target from "../../../assets/img/target.svg";
// Images
import BSC from "../../../assets/img/bsc.svg"
import ETH from "../../../assets/img/coin/eth.svg";
import Polygon from "../../../assets/img/coin/polygon.svg";
import TON from "../../../assets/img/ton.svg";
import USDT from "../../../assets/img/coin/usdt.svg";
import {useAppSelector} from "../../../hooks/storage";
import TOKEN_DECIMALS from "../../../data/tokenDecimals.json";

const CHAIN_LOGOS = {
    BSC,
    Polygon,
    TON,
}

const TOKEN_LOGOS = {
    TON,
    USDT
}

export default function PoolBox({ poolData }) {
    
    const pools = useAppSelector((state) => state.pools);

    const relevantPool = pools.pools.find(item => item.token === poolData.token && item.chain === poolData.chain);


    return (
        <div className="poolBox">
            <div className="poolboxTop">
                <div className="poolboxTopLeft">
                    <div className="chainToken">
                        <img src={TOKEN_LOGOS[poolData.token]} alt={`${poolData.token}`} className="mainChain" />
                        <img src={CHAIN_LOGOS[poolData.chain]} alt={`${poolData.chain}`} className="onChain" />
                    </div>
                    <div className="">
                        <h2>{poolData.token}</h2>
                        on {poolData.chain}
                    </div>
                </div>
                <div className="poolboxTopRight">
                    <Link to="./your-liquidity" className="tragetLink">
                        <img src={Target} alt="Target" />
                    </Link>
                    <div>
                        {!relevantPool ? (
                            <Skeleton height={16} width={50} />
                        ) : (
                            <>
                                <b>APY</b> {relevantPool?.apy}%
                            </>
                        )}
                    </div>
                </div>
            </div>
            <div className="poolboxBottom">
                <div className="row">
                    <div className="col-6">
                        <h4>Deposit</h4>
                        <h3>
                            {!poolData || !relevantPool ? (
                                <Skeleton height={20} width={80} />
                            ) : (
                                `${poolData.token} ${(poolData.balance / 10 ** TOKEN_DECIMALS[poolData.token]).toLocaleString()}`
                            )}
                        </h3>
                    </div>
                    <div className="col-6">
                        <h4>Your Rewards</h4>
                        <h3>
                            {!poolData || !relevantPool
                                ? (
                                    <Skeleton height={20} width={80} />
                                ) : (
                                    `${poolData.token} ${(poolData.rewards  / 10 ** TOKEN_DECIMALS[poolData.token]).toLocaleString()}`
                                )}
                        </h3>
                    </div>
                </div>
            </div>
        </div>
    );
}