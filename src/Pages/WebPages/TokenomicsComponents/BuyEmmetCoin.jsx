import React, { useEffect, useState } from "react";
import "./BuyEmmetCoin.css";
import { useAccount } from "wagmi";
import { useAppKit } from '@reown/appkit/react';
import { useSearchParams } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../../hooks/storage";
import { setPay } from "../../../store/tokensaleSlice";
import useTokenSale from "../../../hooks/useTokenSale";
import ButtonSpinner from "../../CommonComponents/Spinner/ButtonSpinner";
import { modal } from "../../../App";
import { findChainfromName } from "../../../utils";
import useTabVisibility from "../../../hooks/useTabVisibility";
import { setCash } from "../../../store/tokensaleSlice";

const availableCashTokens = [
  { name: "USDT", icon: "/img/USDT.svg" },
  { name: "USDC", icon: "/img/coin/usdc.svg" },
];

const insufficientBalance = "Insufficient balance"
const captionApprove = "Approve";
const captionBuy = "Buy Tokens";
const connectWallet = "Connect your BSC wallet";

function BuyEmmetCoin() {

  const { isConnected, account } = useAccount();
  const tokensale = useAppSelector(state => state.tokensale);
  const dispatch = useAppDispatch();
  const { open } = useAppKit();
  const { isTabActive } = useTabVisibility();

  const [searchParams] = useSearchParams();
  const ref = searchParams.get("ref");

  const [amount, setAmount] = useState(0);
  const [oldAmount, setOldAmount] = useState("");

  const [caption, setCaption] = useState("Enter Amount");
  const [showSpinner, setShowSpiner] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [cashToken, setCashToken] = useState(tokensale.cash || "USDT");
  const [isCashDropdownVisible, setCashDropdownVisible] = useState(false);

  const { approve, purchase, isAwaiting } = useTokenSale();

  const isTokensale = window.location.href.includes("/tokensale");

  const tokensaleChain = "BSC";

  const payTokenChange = (e) => {
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
    setShowSpiner(isAwaiting);
  }, [isAwaiting]);

  useEffect(() => {
    if (amount) {
      let sanitized = String(amount)
        .replace(/[^0-9.]/g, "") // any non digits
        .replace(/^0+([1-9]+\.\d*|0\.)/, "$1"); // multiple zeros before . with one
      if (parseFloat(sanitized) < 1) sanitized = 20;
      if (parseFloat(sanitized) > 10_000_000) sanitized = 10_000_000;
      setAmount(sanitized);
      setOldAmount(sanitized);

      if (sanitized != ".") {
        dispatch(setPay(sanitized));
      }
    } else {
      dispatch(setPay(oldAmount));
    }
  }, [amount]);

  const maxClick = () => {
    dispatch(setPay(tokensale.balance));
  }

  const mainButtonClick = () => {

    if (caption === connectWallet) {
      open();
      if (modal.getChainId() !== 56) {
        modal.switchNetwork(findChainfromName(tokensaleChain));
      }
    } else if (caption === captionApprove) {
      setDisabled(true);
      approve(tokensale.pay);
      setShowSpiner(true);
    } else if (caption === captionBuy) {
      setDisabled(true);
      purchase(tokensale.pay, ref ? ref : "");
      setShowSpiner(true);
    }

  }

  useEffect(() => {

    if (isTabActive && isTokensale && modal.getChainId() !== 56) {
      modal.switchNetwork(findChainfromName(tokensaleChain));
    }

  }, [modal.getChainId(), isConnected, account, amount]);

  useEffect(() => {

    if (isConnected) {

      if (!tokensale.pay) {
        setDisabled(true);
        setCaption("Enter Amount");
      } else if (tokensale.pay && tokensale.pay > tokensale.balance) {
        setDisabled(true);
        setCaption(insufficientBalance);
      } else if (tokensale.pay > tokensale.allowance) {
        setDisabled(false);
        setCaption(captionApprove);
      } else {
        setDisabled(false);
        setCaption(captionBuy);
        setShowSpiner(false);
      }

    } else {
      setDisabled(false);
      setCaption(connectWallet);
    }

  }, [
    tokensale.pay,
    isAwaiting,
    tokensale.allowance,
    isConnected
  ]);

  return (
    <>
      <div className="iwantbuyEmmet">
        <div className="emmetBuyColum">
          <div className="emmetSpentBox">
            <p className="label">I want to spend</p>
            <div className="emmetSpentinput" style={{ justifyContent: "space-between" }}>
              <input
                type="text"
                value={tokensale.pay}
                onChange={e => payTokenChange(e)}
                style={{ "width": "142px" }}
                placeholder="0"
              />
              <button
                className="max"
                onClick={maxClick}
              >MAX</button>
            </div>
          </div>
          <div className="emmetBalance">
            <p className="label right-text">Pay with</p>
            <div
              className="receiveEmmet"
              style={{  cursor: "pointer", position: "relative" }}
            >
              <div
                className="selectedCoin"
                onClick={() => setCashDropdownVisible(!isCashDropdownVisible)}
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
              >
                <div className="coinNameIcon" style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                  <img
                    src={availableCashTokens.find(t => t.name === cashToken)?.icon}
                    alt={cashToken}
                    style={{ width: "20px", height: "20px" }}
                  />
                  <span>{cashToken}</span>
                </div>
                <img src="/img/down-white.svg" alt="Down Arrow" style={{ marginLeft: "20px", width: "12px", gap: "20px" }} />
              </div>
              {isCashDropdownVisible && (
                <ul
                  className="selectCoinList visible"
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    background: "#1e1e1e",
                    border: "1px solid #333",
                    width: "100%",
                    zIndex: 10,
                  }}
                >
                  {availableCashTokens.map((coin) => (
                    <li
                      key={coin.name}
                      className="coinItem"
                      onClick={() => {
                        setCashToken(coin.name);
                        dispatch(setCash(coin.name));
                        setCashDropdownVisible(false);
                      }}
                      style={{
                        padding: "6px 12px",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        cursor: "pointer",
                      }}
                    >
                      <img src={coin.icon} alt={coin.name} style={{ width: "20px", height: "20px" }} />
                      <span>{coin.name}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
        <div className="emmetBuyColum">
          <div className="emmetSpentBox">
            <p className="label">I will receive</p>
            <div className="emmetSpentinput">
              <h2>{tokensale.receive.toLocaleString()}</h2>
            </div>
          </div>
          <div className="emmetBalance">
            <p className="label right-text">1 EMMET ≈ 0.0125 USDT</p>
            <div className="receiveEmmet">
              <img src="/img/emmet/Tokens.svg" alt="" /> <span>EMMET</span>
            </div>
          </div>
        </div>
      </div>
      <button
        className="connectWallet"
        onClick={mainButtonClick}
        disabled={disabled}
      >
        {showSpinner && <ButtonSpinner />}
        {caption}
      </button>
      <button
        className="connectWallet"
        onClick={mainButtonClick}
        disabled={true}
      ><a
        href="/pay-with-card"
        className="color-white"
      >
          <img src="/img/creditcard.svg" />
          {` Purchase USDT with a credit card`}
        </a>
      </button>
    </>
  );
}

export default BuyEmmetCoin;
