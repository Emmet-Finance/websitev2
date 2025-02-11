import React, { useEffect, useState } from "react";
import { useAppSelector } from "../../../hooks/storage";
import Skeleton from "../../CommonComponents/Skeleton/Skeleton";
import "../../ExplorerComponents/ExplorerTransactions/ExplorerTransactions.css"

export default  function PoolTableTitle() {
  const pools = useAppSelector((state) => state.pools);

  const [loading, setLoading] = useState(true)
  const [tlv, setTLV] = useState(0);

  useEffect(() => {
    (async () => {
      setLoading(true)
      let sum = 0;
      pools.pools.forEach(element => {
        sum += element.supply
      });
      setTLV(sum);
      setLoading(false)
    })();
  }, [pools.pools.length]);

  return (
    <div className="poolTableTitle explorerTransactionsTitle">
      <h2>Existing pools</h2>
      <div>
        {loading 
        ? (<Skeleton height={12} width={80} />) 
        : (`TVL: $${tlv}`)}
      </div>
    </div>
  );
}