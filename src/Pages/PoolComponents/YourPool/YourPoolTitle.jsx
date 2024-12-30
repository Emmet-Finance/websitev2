import React, { useEffect, useState } from "react";
import Yourliquidity from "../PoolTable/Yourliquidity";
import { useAppSelector } from "../../../hooks/storage";
import { Link } from "react-router-dom";
import Skeleton from "../../CommonComponents/Skeleton/Skeleton";
import usePool from "../../../hooks/usePool";

function YourPoolTitle() {
  const [isYourLiquidityVisible, setYourLiquidityVisible] = useState(false);
  const handleAddPollClick = () => {
    setYourLiquidityVisible(!isYourLiquidityVisible);
  };
  const pool = useAppSelector((state) => state.pool);
  const [tonRewards, setTonRewards] = useState(0);
  const [tontonRewards, setTonTonRewards] = useState(0);
  const [loading, setLoading] = useState(false);

  const { getData } = usePool();

  useEffect(() => {
    (async () => {
      setLoading(true);
      const _data = await getData("TON", "USDT");
      setTonRewards(_data.pendingRewards);
      const _data2 = await getData("TON", "TON");
      setTonTonRewards(_data2.pendingRewards);
      setLoading(false);
    })();
  }, []);
  return (
    <>
      <div className="yourPoolTitle">
        <div className="poolTitleLeft">
          <h5>Your pool</h5>
          <p>
            {loading ? (
              <Skeleton width={80} height={12} />
            ) : (
              `Total Rewards: $${pool.pendingRewards + tonRewards + tontonRewards}`
            )}
          </p>
        </div>
        <div className="poolTitlerRight">
          <Link
            to="./your-liquidity"
            className="addLiquidity"
            onClick={handleAddPollClick}
          >
            Add liquidity
          </Link>
        </div>
      </div>
      {/* {isYourLiquidityVisible && <Yourliquidity />} */}
    </>
  );
}

export default YourPoolTitle;
