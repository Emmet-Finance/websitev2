import React from "react";
import PoolTableTitle from "./PoolTableTitle";
import PoolByToken from "./PoolByTokken";
import PoolByChain from "./PoolByChain";

export default  function PoolTableTop() {
  return (
    <div className="poolTableTop explorerTransactions">
      <div className="poolTableLeft">
        <PoolTableTitle />
      </div>
      <div className="transactionRight  poolTableRight">
        <PoolByToken />
        <PoolByChain />
      </div>
    </div>
  );
}
