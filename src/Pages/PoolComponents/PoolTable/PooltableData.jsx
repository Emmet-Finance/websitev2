import React, { useEffect, useState } from "react";
import "./PoolTable.css";
import Updown from "../../../assets/img/table-updown.svg";
import { useAppDispatch, useAppSelector } from "../../../hooks/storage";
import poolTokens from "../../../data/poolCoins.json";
import poolChains from "../../../data/poolChains.json";
import { useNavigate } from "react-router-dom";
import usePoolData from "../../../hooks/usePoolData";
import Skeleton from "../../CommonComponents/Skeleton/Skeleton";

const PoolTable = () => {
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  // const [isYourLiquidityVisible, setYourLiquidityVisible] = useState(false);
  const pool = useAppSelector((state) => state.pool);
  const pools = useAppSelector((state) => state.pools);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { getData } = usePoolData();
  const [loading, setLoading] = useState(true);
  const [populated, setPopulated] = useState(false);
  const [data, setData] = useState(pools.pools);

  const getTokenIcon = (token) => {
    return poolTokens ? poolTokens.find((i) => i.name === token)?.icon : "";
  };

  const getChainIcon = (chain) => {
    return poolChains ? poolChains.find((i) => i.name === chain)?.icon : "";
  };

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
      (pool.byChain === "Show All" || pool.byChain === item.chain) &&
      (pool.byToken === "Show All" || pool.byToken === item.token)
    );
  };

  // const sortedData = ;

  useEffect(() => {
    if (data) {

      let _data = [...data].sort((a, b) => {
        if (sortOrder === "asc") {
          return a[sortBy] > b[sortBy] ? 1 : -1;
        } else {
          return a[sortBy] < b[sortBy] ? 1 : -1;
        }
      });

      setData(_data);
    }

  }, [sortBy, sortOrder]);

  useEffect(() => {
    setData(pools.pools);
    setLoading(false);
    setPopulated(true);
  }, [pools.pools.length])

  // useEffect(() => {
  //   if(!populated){
  //     (async () => {
  //       setLoading(true);
  //       setData(pools.pools
  //         // await Promise.all(
  //         //   data.map(async (i) => {
  //         //     const _data = await getData(i.chain, i.token);
  //         //     return {
  //         //       ...i,
  //         //       apy: _data && _data.apy ? _data.apy : 0,
  //         //       totalLiquidity: _data && _data.totalSupply ? Number(_data.totalSupply) : 0,
  //         //     };
  //         //   }),
  //         // ),
  //       );
  //       setLoading(false);
  //       setPopulated(true)
  //     })();
  //   }
  // },);

  const handleAddPollClick = (item) => {
    navigate("./your-liquidity", {
      state: { chain: item.chain, token: item.token },
    });
    // setYourLiquidityVisible(!isYourLiquidityVisible);
  };

  return (
    <>
      <div className="transactionTable poolTable">
        <table className="table">
          <thead>
            <tr>
              <th className="tableHead" onClick={() => handleSort("token")}>
                Token{" "}
                <span className="upDown">
                  <img src={Updown} alt="Updown" />
                </span>
              </th>
              <th className="tableHead" onClick={() => handleSort("chain")}>
                Chain{" "}
                <span className="upDown">
                  <img src={Updown} alt="Updown" />
                </span>
              </th>
              <th className="tableHead" onClick={() => handleSort("apy")}>
                APY{" "}
                <span className="upDown">
                  <img src={Updown} alt="Updown" />
                </span>
              </th>
              {/* <th onClick={() => handleSort("Daily")}>
                Volume (24h){" "}
                <span className="upDown">
                  <img src={Updown} alt="Updown" />
                </span>
              </th> */}
              <th
                className="tableHead"
                onClick={() => handleSort("TotalLiquidity")}
              >
                Total liquidity{" "}
                <span className="upDown">
                  <img src={Updown} alt="Updown" />
                </span>
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data.map(
              (item, index) =>
                filter(item) && (
                  <TableDataRow
                    item={item}
                    getChainIcon={getChainIcon}
                    getTokenIcon={getTokenIcon}
                    handleAddPollClick={handleAddPollClick}
                    key={index}
                    loading={loading}
                  />
                ),
            )}
          </tbody>
        </table>
      </div>
      {/* {isYourLiquidityVisible && <Yourliquidity />} */}
    </>
  );
};

function TableDataRow({
  item,
  getTokenIcon,
  getChainIcon,
  handleAddPollClick,
  loading,
}) {
  return (
    <tr>
      <td>
        <span className="poolCoin">
          <img src={getTokenIcon(item.token)} alt={item.token} /> {item.token}
        </span>
      </td>
      <td>
        <span className="poolCoin">
          <img src={getChainIcon(item.chain)} alt="eth" /> {item.chain}
        </span>
      </td>
      <td>
        <span style={{ color: "#E0E3E6" }}>
          {loading ? <Skeleton height={16} width={60} /> : `${item.apy}%`}
        </span>
      </td>
      {/* <td>$43,432.00</td> */}
      <td>
        <span className="totleLiqui">
          {loading ? (
            <Skeleton height={16} width={100} />
          ) : (
            `${Number(item.supply).toLocaleString()}`
          )}
        </span>
      </td>
      <td>
        <button className="addPoll" onClick={() => handleAddPollClick(item)}>
          <img src="/img/add.svg" alt="Add" />
        </button>
      </td>
    </tr>
  );
}

export default PoolTable;
