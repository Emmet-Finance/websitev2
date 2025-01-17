import React from "react";
import YourPoolTitle from "./YourPoolTitle";
import PoolBox from "./PoolBox";
import supportedPools from "../../../data/pools.json"

export default function YourPool() {

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