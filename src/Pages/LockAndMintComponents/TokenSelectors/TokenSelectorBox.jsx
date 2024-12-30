import React, { useState, useEffect } from "react";
import "./TokenSelectorBox.css";
// Components
import ButtonSpinner from "../../CommonComponents/Spinner/ButtonSpinner";
import WalletBalance from "../WalletBalance";
import TokenSelectionDropdown from "./TokenSelectionDropdown";
import { removeTrailingZeroes } from "../../../utils";
import { useAppSelector, useAppDispatch } from "../../../hooks/storage";
import { setBridgeAmount } from "../../../store/bridgeSlice";
import ChainSelectorDropdown from "../ChainSelectorDropdown/ChainSelectorDropdown";
import DestinationChainDropdown from "../ChainSelectorDropdown/DestinationChainDropdown";
import useBalance from "../../../hooks/useBalance";

export default function TokenSelectorBox({ type }) {
  const dispatch = useAppDispatch();
  // Global state
  const bridge = useAppSelector((state) => state.bridge);

  const { 
    fromBalance, 
    toBalance, 
    isZeroBalance,
    isZeroToBalance 
  } = useBalance();

  const [amount, setAmount] = useState("");
  const [oldAmount, setOldAmount] = useState("");

  function onInputChange(e) {
    e.preventDefault();
    let newValue = e.target.value;

    // Ensure there is at most one period in the input
    const periodCount = (newValue.match(/\./g) || []).length;
    if (periodCount > 1) {
      // Remove the last period
      newValue = newValue.slice(0, -1); //
    }
    const commaCount = (newValue.match(/\,/g) || []).length;
    if (commaCount) {
      newValue = newValue.slice(0, -1);
    }
    if (newValue) {
      setAmount(newValue);
    } else {
      setAmount("");
      setOldAmount("");
    }
  }

  useEffect(() => {
    if (amount) {
      let sanitized = String(amount)
        .replace(/[^0-9.]/g, "") // any non digits
        .replace(/^0+([1-9]+\.\d*|0\.)/, "$1"); // multiple zeros before . with one
      if (parseFloat(sanitized) < 1) sanitized = 1;
      if (parseFloat(sanitized) > 10_000_000) sanitized = 10_000_000;
      setAmount(sanitized);
      setOldAmount(sanitized);

      if (sanitized != ".") {
        dispatch(setBridgeAmount(sanitized));
      }
    } else {
      dispatch(setBridgeAmount(oldAmount));
    }
  }, [amount]);

  function isFromType() {
    return type && type === "from";
  }

  return (
    <span className={isFromType() ? "order1" : "order3"}>
      <div className="SwapPay swapPayReceive">
        <div className="payReLeftBox">
          <div className="payReLeft payOption">
            <div className="payInput">
              <p>{isFromType() ? "From" : "To"}</p>
              {isFromType() ? (
                <ChainSelectorDropdown
                  parent="lock-and-mint"
                  direction={type}
                />
              ) : (
                <DestinationChainDropdown />
              )}
            </div>
            <h2 className="amount">
              <input
                onChange={(e) => onInputChange(e)}
                placeholder="0.0"
                disabled={type && type === "to" ? true : false}
                value={
                  type && type === "from"
                    ? bridge.amount
                    : bridge.receive &&
                      removeTrailingZeroes(Number(bridge.receive))
                }
              />
            </h2>
          </div>
        </div>
        <div className="payReRight">
          <WalletBalance
            parent="lock-and-mint"
            name={isFromType() ? bridge.fromToken : bridge.toToken}
            balance={isFromType() ? fromBalance : toBalance}
            showSpinner={isFromType() ? fromBalance === 0 && !isZeroBalance : toBalance === 0 && !isZeroToBalance}
          />
          <TokenSelectionDropdown type={type} />
        </div>
      </div>
    </span>
  );
}
