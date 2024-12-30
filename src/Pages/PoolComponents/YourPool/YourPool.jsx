import React, { useEffect } from "react";
import YourPoolTitle from "./YourPoolTitle";
import PoolBox from "./PoolBox";
import usePool from "../../../hooks/usePool";

const supportedPools = [
  {
    chain: "BSC",
    token: "USDT"
  },
  {
    chain: "Polygon",
    token: "USDT"
  },
  {
    chain: "TON",
    token: "USDT"
  },
  {
    chain: "TON",
    token: "TON"
  },
];

function YourPool() {
  return (
    <div className="yourPool">
      <YourPoolTitle />
      <div className="pollRow row">
        {
          supportedPools.map((pool, i) =>
            <div key={i} className="col-lg-3">
            <PoolBox
              chainName={pool.chain}
              tokenName={pool.token}
            />
          </div>
          )
        }
      </div>
    </div>
  );
}

export default YourPool;
