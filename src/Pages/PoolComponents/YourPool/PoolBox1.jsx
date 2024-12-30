import React, { useEffect, useState } from "react";

import USDT from "../../../assets/img/coin/usdt.svg";
import ETH from "../../../assets/img/coin/eth.svg";
import Target from "../../../assets/img/target.svg";
import { useAppSelector } from "../../../hooks/storage";
import { Link } from "react-router-dom";
import usePool from "../../../hooks/usePool";
import { useAccount } from "wagmi";
import Skeleton from "../../CommonComponents/Skeleton/Skeleton";
function PoolBox1() {
  const { getData, getBalance } = usePool();
  const pool = useAppSelector((state) => state.pool);
  const bridge = useAppSelector((state) => state.bridge);
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
      const _data = await getData("Polygon", "USDT", address);
      setData(_data);
      const _stakedBalance = await getBalance(
        "Withdraw",
        "Polygon",
        "USDT",
        address,
      );
      setStakedBalance(_stakedBalance);
      setLoading(false);
    })();
  }, [address]);

  return (
    <div className="poolBox">
      <div className="poolboxTop">
        <div className="poolboxTopLeft">
          <div className="chainToken">
            <img src={USDT} alt="USDT" className="mainChain" />
            <img src={ETH} alt="ETH" className="onChain" />
          </div>
          <div className="">
            <h2>USDT</h2>
            on Polygon
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

export default PoolBox1;
