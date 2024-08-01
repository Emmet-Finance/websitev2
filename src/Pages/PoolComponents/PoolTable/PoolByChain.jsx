import React from "react";

import ChainSelectorDropdown from "../../PoolComponents/ChainSelectorDropdown/ChainSelectorDropdown";

function PoolByChain() {
  return (
    <div className="ExplorerTransactionsFilter buyChainFilter">
      <div className="filterName">By network</div>
      <div className="filterDropdown">
        <ChainSelectorDropdown />
      </div>
    </div>
  );
}

export default PoolByChain;
