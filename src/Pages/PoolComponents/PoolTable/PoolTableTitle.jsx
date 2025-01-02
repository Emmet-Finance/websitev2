import React, { useEffect, useState } from "react";
import { useAppSelector } from "../../../hooks/storage";
import usePoolData from "../../../hooks/usePoolData";
import Skeleton from "../../CommonComponents/Skeleton/Skeleton";

function PoolTableTitle() {
  const pool = useAppSelector((state) => state.pool);
  const [tonLiquidityPoolInUSD, setTonLiquidityPoolInUSD] = useState(0);
  const [tontonLiquidityPoolInUSD, setTonTonLiquidityPoolInUSD] = useState(0);
  const [loading, setLoading] = useState(false);

  const { getData } = usePoolData();

  // TODO: FIX - inject the correft array & request / compute once

  useEffect(() => {
    (async () => {
      setLoading(true);
      const _data = await getData("TON", "USDT");
      setTonLiquidityPoolInUSD(parseFloat(_data.liquidityPoolInUSD));
      const _data2 = await getData("TON", "TON");
      setTonTonLiquidityPoolInUSD(parseFloat(_data2.liquidityPoolInUSD));
      setLoading(false);
    })();
  }, []);

  return (
    <div className="poolTableTitle explorerTransactionsTitle">
      <h2>Active pools</h2>
      <p>
        {loading ? (
          <Skeleton height={12} width={80} />
        ) : (
          `TVL: $${
            parseFloat(pool.liquidityPoolInUSD) +
            tonLiquidityPoolInUSD +
            tontonLiquidityPoolInUSD
          }`
        )}
      </p>
    </div>
  );
}

export default PoolTableTitle;
