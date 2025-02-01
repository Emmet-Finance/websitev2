import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Skeleton from "../../CommonComponents/Skeleton/Skeleton";
import { useAppSelector } from "../../../hooks/storage"

export default function YourPoolTitle() {

  const pools = useAppSelector((state) => state.pools);

  const [rewards, setRewards] = useState(0);

  useEffect(() => {
    if (pools && pools.positions) {
      let sum = 0;
      pools.positions.map(item => {
        const relevantPool = pools.pools.find(pool => pool.token === item.token && pool.chain === item.chain);
        if (relevantPool && relevantPool.decimals) {
          sum += item.rewards / 10 ** relevantPool.decimals;
        }
      });
      setRewards(sum);
    }

  }, [pools.pools.length, pools.positions.length])

  return (
    <>
      <div className="yourPoolTitle">
        <div className="poolTitleLeft">
          <h5>Your positions</h5>
          <div>
            {!pools.pools ? (
              <Skeleton width={80} height={12} />
            ) : (
              `Total Rewards: ${rewards.toLocaleString()}`
            )}
          </div>
        </div>
        <div className="poolTitlerRight">
          <Link
            to="./your-liquidity"
            className="addLiquidity"
          >
            Add liquidity
          </Link>
        </div>
      </div>
    </>
  );
}