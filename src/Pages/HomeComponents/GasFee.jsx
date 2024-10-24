import React, { useState, useEffect } from "react";
import { useFeeData, useAccount } from "wagmi";

function GasFee() {
  const { data, status } = useFeeData();
  const { chain } = useAccount();

  const [gasPrice, setGasPrice] = useState("3");
  const [coin, setCoin] = useState("");

  useEffect(() => {
    if (data && status === "success") {
      setGasPrice(data.formatted.gasPrice);
    }
  }, [data, status]);

  useEffect(() => {
    if (chain && chain.nativeCurrency && chain.nativeCurrency.symbol) {
      setCoin(chain.nativeCurrency.symbol);
    }
  }, [chain]);

  return (
    <div className="gasFeeContainer">
      <div className="gasFeeLeft">Gas fee</div>
      <div className="gasFeeRight">{gasPrice} Wei</div>
    </div>
  );
}

export default GasFee;
