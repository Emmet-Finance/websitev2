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
import { useTonConnect } from "../../../hooks/useTonConnect";
import { sleep } from "emmet.js";
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

const EMPTY_DATA = {
    apy: 0,
    balance: 0,
    decimals: 1,
    totalSupply: 0,
    protocolFee: 0,
    protocolFeeAmount: 0,
    tokenFee: 0,
    feeGrowthGlobal: 0,
    feeDecimals: 0,
    pendingRewards: 0,
};

const EMPTY_POSITION = {
    $$type: "Position",
    balance: 0,
    last_fee_growth: 0,
    rewards: 0
}

export default function PoolBox({ chainName, tokenName }) {
    // Hooks
    const { getData, getPositions } = usePoolData();

    // Accounts
    const { address, isConnected } = useAccount();
    const { sender: tonSender, connected: isTonConnected } = useTonConnect();

    // Local State
    const [data, setData] = useState(EMPTY_DATA);
    const [loading, setLoading] = useState(false);
    const [position, setPosition] = useState(EMPTY_POSITION);

    const isTon = String(chainName).toLowerCase() === "ton";
    const isEVM = !isTon;

    const tonAddress = tonSender ? tonSender?.address?.toString() : "";
    const account = isTon && isTonConnected
        ? tonAddress
        : isEVM && isConnected
            ? address
            : undefined;

    useEffect(() => {

        if (account) {

          const collectData = async () => {
            setLoading(true);

            try {
              const _data = await getData(chainName, tokenName, account);
              setData(_data);

              await sleep(1000);

              const _position = await getPositions(chainName, tokenName, account);
              if(_position){
                setPosition({
                    ..._position,
                    balance: Number(_position.balance) / 10 ** Number(TOKEN_DECIMALS[tokenName]),
                    rewards: Number(_position.rewards) / 10 ** Number(TOKEN_DECIMALS[tokenName])
                });
              }
              
            } catch (error) {
              console.error("Error collecting data:", error);
              await sleep(1000);
            } finally {
              setLoading(false);
              await sleep(2000);
            }
          };

          collectData();
        }
      }, [account]);


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
                    <div>
                        {loading ? (
                            <Skeleton height={16} width={50} />
                        ) : (
                            <>
                                <b>APY</b> {data?.apy}%
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
                            {loading ? (
                                <Skeleton height={20} width={80} />
                            ) : (
                                `${tokenName} ${position.balance.toLocaleString()}`
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
                                    `${tokenName} ${position.rewards.toLocaleString()}`
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