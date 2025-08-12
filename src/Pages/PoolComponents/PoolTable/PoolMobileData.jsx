import React, { useEffect, useState } from "react";
import Yourliquidity from "./Yourliquidity";
import { Link, useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../hooks/storage";
import poolTokens from "../../../data/poolCoins.json";
import poolChains from "../../../data/poolChains.json";
import usePoolData from "../../../hooks/usePoolData";
import Skeleton from "../../CommonComponents/Skeleton/Skeleton";
import data from "../../../data/pools.json";

function PoolMobileData() {
  const [isYourLiquidityVisible, setYourLiquidityVisible] = useState(false);
  const navigate = useNavigate();

  const handleAddPollClick = (item) => {
    setYourLiquidityVisible(!isYourLiquidityVisible);
    navigate("./your-liquidity", {
      state: { chain: item.chain, token: item.token },
    });
  };
  const pool = useAppSelector((state) => state.pool);

  const getTokenIcon = (token) => {
    return poolTokens ? poolTokens.find((i) => i.name === token)?.icon : "";
  };

  const getChainIcon = (chain) => {
    return poolChains ? poolChains.find((i) => i.name === chain)?.icon : "";
  };

  const filter = (item) => {
    return (
      (pool.byChain === "Show All" || pool.byChain === item.chain) &&
      (pool.byToken === "Show All" || pool.byToken === item.token)
    );
  };

  return (
    <>
      <div className="poolMobileData">
        {data.map(
          (item, index) =>
            filter(item) && (
              <TableData
                getChainIcon={getChainIcon}
                getTokenIcon={getTokenIcon}
                handleAddPollClick={handleAddPollClick}
                item={item}
                key={index}
              />
            ),
        )}
      </div>
      {/* {isYourLiquidityVisible && <Yourliquidity />} */}
      <div className="mobileDeposite">
        <Link to="./your-liquidity" type="button" className="depositeBtn ">
          Deposit
        </Link>
      </div>
    </>
  );
}

const TableData = ({
  item,
  getTokenIcon,
  getChainIcon,
  handleAddPollClick,
}) => {
  const { getData } = usePoolData();
  const [loading, setLoading] = useState(false);
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
    liquidityPoolInUSD: 0,
  });

  useEffect(() => {
    (async () => {
      setLoading(true);
      const _data = await getData(item.chain, item.token);
      setData(_data);
      setLoading(false);
    })();
  }, []);
  return (
    <div className="poolBox addDepositBox">
      <div className="poolboxTop">
        <div className="poolboxTopLeft">
          <div className="chainToken">
            <img
              src={getTokenIcon(item.token)}
              alt="USDT"
              className="mainChain"
            />
            <img src={getChainIcon(item.chain)} alt="ETH" className="onChain" />
          </div>
          <div className="">
            <h2>{item.token}</h2>
            on {item.chain}
          </div>
        </div>
      </div>
      <div className="poolboxBottom">
        <div className="row">
          <div className="col-6">
            <h4>Total liquidity</h4>
            <h3>
              {loading ? (
                <Skeleton height={16} width={80} />
              ) : (
                `${data && data.totalSupply ? data.totalSupply : 0}`
              )}
            </h3>
          </div>
          <div className="col-6">
            <h4>APY</h4>
            <h3>
              {loading ? <Skeleton height={16} width={80} /> : `${data && data.apy ? data.apy : 0}%`}
            </h3>
          </div>
          <div className="addDeposit">
            <button
              className="addDepositBtn"
              onClick={() => handleAddPollClick(item)}
            >
              + Add deposit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoolMobileData;
