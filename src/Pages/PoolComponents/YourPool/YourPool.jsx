import React, { useEffect, useState } from "react";
import { sleep } from "emmet.js";
import YourPoolTitle from "./YourPoolTitle";
import PoolBox from "./PoolBox";
import usePoolData from "../../../hooks/usePoolData";
import supportedPools from "../../../data/pools.json";
import { useAccount } from "wagmi";
import { useTonConnect } from "../../../hooks/useTonConnect";
import TOKEN_DECIMALS from "../../../data/tokenDecimals.json";
import { useAppSelector } from "../../../hooks/storage";

export default function YourPool() {

  const pools = useAppSelector((state) => state.pools);

  return (
    <div className="yourPool">
      <YourPoolTitle/>
      <div className="pollRow row">
        {
          pools.positions.map((position, i) =>
            <div key={i} className="col-lg-3">
              <PoolBox
                poolData={position}
              />
            </div>
          )
        }
      </div>
    </div>
  );
}