import React, { useState } from "react";

import Updown from "../../../assets/img/table-updown.svg";
import Yourliquidity from "./Yourliquidity";
import { useAppSelector } from "../../../hooks/storage";
import { Link } from "react-router-dom";
import poolTokens from "../../../store/poolCoins.json";
import poolChains from "../../../store/poolChains.json";

const PoolTable = () => {
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [isYourLiquidityVisible, setYourLiquidityVisible] = useState(false);
  const pool = useAppSelector((state) => state.pool);
  const bridge = useAppSelector((state) => state.bridge);

  const getTokenIcon = (token) => {
    return poolTokens.find((i) => i.name === token).icon;
  };

  const getChainIcon = (chain) => {
    return poolChains.find((i) => i.name === chain).icon;
  };

  const data = [
    {
      token: "USDC",
      chain: "Sepolia",
      apy: pool.apy,
      volume: "$43,432.00",
      totalLiquidity: pool.totalSupply,
    },
    {
      token: "USDC",
      chain: "TONTestnet",
      apy: 0,
      volume: "$43,432.00",
      totalLiquidity: 0,
    },
  ];

  const handleSort = (key) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(key);
      setSortOrder("asc");
    }
  };

  const filter = (item) => {
    return (
      pool.byChain === "Show All" ||
      (pool.byChain === item.chain && pool.byToken === "Show All") ||
      pool.byToken === item.token
    );
  };

  const sortedData = [...data].sort((a, b) => {
    if (sortOrder === "asc") {
      return a[sortBy] > b[sortBy] ? 1 : -1;
    } else {
      return a[sortBy] < b[sortBy] ? 1 : -1;
    }
  });

  const handleAddPollClick = () => {
    setYourLiquidityVisible(!isYourLiquidityVisible);
  };

  return (
    <>
      <div className="transactionTable poolTable">
        <table className="table">
          <thead>
            <tr>
              <th onClick={() => handleSort("Token")}>
                Token{" "}
                <span className="upDown">
                  <img src={Updown} alt="Updown" />
                </span>
              </th>
              <th onClick={() => handleSort("Chain")}>
                Chain{" "}
                <span className="upDown">
                  <img src={Updown} alt="Updown" />
                </span>
              </th>
              <th onClick={() => handleSort("APY")}>
                APY{" "}
                <span className="upDown">
                  <img src={Updown} alt="Updown" />
                </span>
              </th>
              <th onClick={() => handleSort("Daily")}>
                Volume (24h){" "}
                <span className="upDown">
                  <img src={Updown} alt="Updown" />
                </span>
              </th>
              <th onClick={() => handleSort("TotalLiquidity")}>
                Total liquidity{" "}
                <span className="upDown">
                  <img src={Updown} alt="Updown" />
                </span>
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map(
              (item, index) =>
                filter(item) && (
                  <tr key={index}>
                    <td>
                      <span class="poolCoin">
                        <img src={getTokenIcon(item.token)} alt={item.token} />{" "}
                        {item.token}
                      </span>
                    </td>
                    <td>
                      <span class="poolCoin">
                        <img src={getChainIcon(item.chain)} alt="eth" />{" "}
                        {item.chain}
                      </span>
                    </td>
                    <td>
                      <span style={{ color: "#E0E3E6" }}>{item.apy}%</span>
                    </td>
                    <td>$43,432.00</td>
                    <td>
                      <span class="totleLiqui">${item.totalLiquidity}</span>
                    </td>
                    <td>
                      <Link
                        to="./your-liquidity"
                        className="addPoll"
                        onClick={handleAddPollClick}
                      >
                        <img src="/img/add.svg" alt="Add" />
                      </Link>
                    </td>
                  </tr>
                ),
            )}
          </tbody>
        </table>
      </div>
      {/* {isYourLiquidityVisible && <Yourliquidity />} */}
    </>
  );
};

export default PoolTable;
