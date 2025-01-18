import React, { useEffect, useState } from "react";
import { sleep } from "emmet.js";
import YourPoolTitle from "./YourPoolTitle";
import PoolBox from "./PoolBox";
import usePoolData from "../../../hooks/usePoolData";
import supportedPools from "../../../data/pools.json";
import { useAccount } from "wagmi";
import { useTonConnect } from "../../../hooks/useTonConnect";
import TOKEN_DECIMALS from "../../../data/tokenDecimals.json";

const EMPTY_DATA = {
  apy: 0,
  balance: 0,
  decimals: 1,
  totalSupply: 0,
  protocolFee: 0,
  protocolFeeAmount: 0,
  tokenFee: 0,
  feeGrowthGlobal: 0,
  feeDecimals: 0,
  pendingRewards: 0,
};

const EMPTY_POSITION = {
  $$type: "Position",
  balance: 0,
  last_fee_growth: 0,
  rewards: 0
}

export default function YourPool() {

  // Hooks
  const { getData, getPositions } = usePoolData();

  // Accounts
  const { address, isConnected } = useAccount();
  const { address: tonAddress, connected: isTonConnected } = useTonConnect();

  const [rewards, setRewards] = useState(0);
  const [loading, setLoading] = useState(false);
  const [poolData, setPooldata] = useState([]);


  useEffect(() => {
    (async () => {
      const updatedPoolData = [];

      setLoading(true);
      supportedPools.map(async item => {

        let account = '';

        switch (String(item.chain).toLowerCase()) {
          case 'ton':
            account = isTonConnected ? tonAddress : undefined;
            break;
        
          default: // EVM
            account = isConnected ? address : undefined;
            break;
        }

        let pool_data = await getData(item.chain, item.token);

        if(!pool_data || !Object.keys(pool_data).includes("$$type")){
          pool_data = EMPTY_DATA
        }

        await sleep(1000);

        let position = await getPositions(item.chain, item.token, account);
        console.log("chain", item.chain, "isTon", position, "account", account)

        if(!position){
          position = EMPTY_POSITION;
        } else {
          position = {
            ...position,
            balance: Number(position.balance) / 10 ** Number(TOKEN_DECIMALS[item.token]),
            rewards: Number(position.rewards) / 10 ** Number(TOKEN_DECIMALS[item.token])
          }
        }

        const newRewards = rewards + Number(position.rewards.toString());
        // Update global rewards
        setRewards(newRewards);
        // Push the pool data
        updatedPoolData.push({
          ...item,
          ...pool_data,
          ...position
        });

        setPooldata(updatedPoolData);
      });
      setLoading(false);
    })();
  }, []);

  return (
    <div className="yourPool">
      <YourPoolTitle
        isLoading={loading}
        rewards={rewards}
      />
      <div className="pollRow row">
        {
          poolData.map((pool, i) =>
            <div key={i} className="col-lg-3">
              <PoolBox
                poolData={pool}
              />
            </div>
          )
        }
      </div>
    </div>
  );
}