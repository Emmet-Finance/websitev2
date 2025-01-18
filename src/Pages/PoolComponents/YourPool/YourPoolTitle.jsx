import React from "react";
import { Link } from "react-router-dom";
import Skeleton from "../../CommonComponents/Skeleton/Skeleton";

export default function YourPoolTitle({isLoading, rewards}) {

  return (
    <>
      <div className="yourPoolTitle">
        <div className="poolTitleLeft">
          <h5>Existing pools</h5>
          <div>
            {isLoading ? (
              <Skeleton width={80} height={12} />
            ) : (
              `Total Rewards: ${rewards}`
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