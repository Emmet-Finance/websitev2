import React, { useState, useEffect, useRef } from "react";
import "./TokenSelectionDropdown.css";
import ReactGA from "react-ga";
// Icons
import DownArrow from "../../../assets/img/down-white.svg";
import Fox from "../../../assets/img/fox.svg";
import coins from "./../../../data/poolCoins.json";
// Components
import CoinLinkAddress from "../../HomeComponents/CoinLinkAddress";
import { useAppSelector, useAppDispatch } from "../../../hooks/storage";
import { setPoolToken } from "../../../store/poolSlice";

export default function TokenSelectionDropdown({ type }) {
  const pool = useAppSelector((state) => state.pool);
  const dispatch = useAppDispatch();

  function showDropdown() {
    if (pool.tokens.length) {
      return true;
    }
    return false;
  }

  function getIcon(tokenName) {
    const selTkn = coins.find((t) => t.name === tokenName);
    return selTkn ? `${isLP() ? "../" : ""}${selTkn.icon}` : "";
  }

  function isLP() {
    return type && type === "LP" ? true : false;
  }

  const [isListVisible, setListVisible] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState({
    icon: getIcon(pool.token),
    name: pool.token,
  });

  useEffect(() => {
    const name = pool.token;
    setSelectedCoin({
      icon: getIcon(pool.token),
      name,
    });

    // dispatch(getIsfrom() ? setFromPrice(name) : setToPrice(name));
  }, [pool.token, pool.chain]);

  const handleCoinClick = (icon, name) => {
    setSelectedCoin({ icon, name });
    toggleVisibility();
    dispatch(setPoolToken(name));
    // dispatch(getIsfrom() ? setFromPrice(name) : setToPrice(name));
    ReactGA.event({
      category: "User",
      action: "Clicked Button",
      label: "Select Swap Coin",
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

  return (
    <div className="selectCoin" ref={selectCoinRef}>
      <div className="selectedCoin" onClick={toggleVisibility}>
        <div className="coinNameIcon">
          <img src={`/${selectedCoin.icon}`} alt={selectedCoin.name} />
          <span>{selectedCoin.name}</span>
        </div>
        {showDropdown() && <img src={DownArrow} alt="Down Arrow" />}
      </div>
      {showDropdown() && (
        <ul
          className={`selectCoinList bridge ${isListVisible ? "visible" : "hidden"}`}
        >
          {pool.tokens.map((coin) => (
            <li className="coinItem" key={coin.name}>
              <div
                className="coinNameIcon"
                onClick={() => handleCoinClick(coin.icon, coin.name)}
              >
                <img
                  src={`${isLP() ? "../" : "/"}${coin.icon}`}
                  alt={coin.name}
                />
                <span>{coin.name}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
