import React, { useState, useEffect, useRef } from "react";
import "./TokenSelectionDropdown.css";
// Icons
import DownArrow from "../../../assets/img/down-white.svg";
import Fox from "../../../assets/img/fox.svg";
import ReactGA from "react-ga";
// Components
import CoinLinkAddress from "../CoinLinkAddress";
import { useAppSelector, useAppDispatch } from "../../../hooks/storage";
import {
  setBridgeDecimals,
  setBridgeFromToken,
  setBridgeToToken,
} from "../../../store/bridgeSlice";
import {
  BridgeTokens,
  CHAIN_TO_TOKENS,
  TOKEN_DECIMALS,
  TOKEN_SYMBOL_TO_TOKEN,
} from "../../../types";
import { getSupportedTokens } from "../../../utils";

export default function TokenSelectionDropdown({ type }) {
  const bridge = useAppSelector((state) => state.bridge);
  const dispatch = useAppDispatch();

  function showDropdown() {
    if (type === "from" ? bridge.fromTokens.length : bridge.toTokens.length) {
      return true;
    }
    return false;
  }

  function getIcon(tokenName) {
    const selTkn = bridge.alltokens.find((t) => t.name === tokenName);
    return selTkn ? selTkn.icon : "";
  }

  function getIsfrom() {
    return type && type === "from" ? true : false;
  }

  const [isListVisible, setListVisible] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState({
    icon: getIsfrom() ? getIcon(bridge.fromToken) : getIcon(bridge.toToken),
    name: getIsfrom() ? bridge.fromToken : bridge.toToken,
  });

  useEffect(() => {

    setSelectedCoin({
      icon: getIsfrom() ? getIcon(bridge.fromToken) : getIcon(bridge.toToken),
      name: getIsfrom()
        ? TOKEN_SYMBOL_TO_TOKEN[bridge.fromToken]
        : TOKEN_SYMBOL_TO_TOKEN[bridge.toToken],
    });
  }, [bridge.fromToken, bridge.toToken]);

  const handleCoinClick = (icon, name) => {
    setSelectedCoin({ icon, name });
    toggleVisibility();
    dispatch(getIsfrom() ? setBridgeFromToken(name) : setBridgeToToken(name));
    ReactGA.event({
      category: "User",
      action: "Clicked Button",
      label: "Token Select",
    });
  };

  const toggleVisibility = () => {
    setListVisible(!isListVisible);
  };

  const selectCoinRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        selectCoinRef.current &&
        !selectCoinRef.current.contains(event.target)
      ) {
        setListVisible(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    dispatch(setBridgeDecimals(TOKEN_DECIMALS[selectedCoin.name]));
  }, [selectedCoin]);

  return (
    <div className="selectCoin" ref={selectCoinRef}>
      <div className="selectedCoin" onClick={toggleVisibility}>
        <div className="coinNameIcon">
          <img src={selectedCoin.icon} alt={selectedCoin.name} />
          <span>{selectedCoin.name}</span>
        </div>
        {showDropdown() && <img src={DownArrow} alt="Down Arrow" />}
      </div>
      {showDropdown() && type === "from" ? (
        <ul
          className={`selectCoinList bridge ${isListVisible ? "visible" : "hidden"}`}
        >
          {bridge.fromTokens.map((coin) => (
            <li className="coinItem" key={coin.name}>
              <div
                className="coinNameIcon"
                onClick={() => handleCoinClick(coin.icon, coin.name)}
              >
                <img src={coin.icon} alt={coin.name} />
                <span>{TOKEN_SYMBOL_TO_TOKEN[coin.name]}</span>
              </div>
              {/* <div className="coinItemRight">
                <CoinLinkAddress />
                <a href="#" className="foxLink">
                  <img src={Fox} alt="Metamask" />
                </a>
              </div> */}
            </li>
          ))}
        </ul>
      ) : (
        <ul
          className={`selectCoinList bridge ${isListVisible ? "visible" : "hidden"}`}
        >
          {bridge.toTokens.map((coin) => (
            <li className="coinItem" key={coin.name}>
              <div
                className="coinNameIcon"
                onClick={() => handleCoinClick(coin.icon, coin.name)}
              >
                <img src={coin.icon} alt={coin.name} />
                <span>{TOKEN_SYMBOL_TO_TOKEN[coin.name]}</span>
              </div>
              {/* <div className="coinItemRight">
            <CoinLinkAddress />
            <a href="#" className="foxLink">
              <img src={Fox} alt="Metamask" />
            </a>
          </div> */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
