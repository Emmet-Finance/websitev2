import React, { useState, useEffect, useRef } from "react";
import ReactGA from "react-ga";
// Icons
import DownArrow from "../../../assets/img/down-white.svg";
import Fox from "../../../assets/img/fox.svg";
import coins from "./../../../data/coins.json";
// Components
import CoinLinkAddress from "../../HomeComponents/CoinLinkAddress";
import { useAppSelector, useAppDispatch } from "../../../hooks/storage";
import { setPoolByToken } from "../../../store/poolSlice";
import poolTokens from "../../../data/poolCoins.json";

const showAll = {
  name: "Show All",
};

export default function PoolByTokenSelector({ type }) {
  const pool = useAppSelector((state) => state.pool);

  const filterList = [showAll, ...poolTokens];
  const dispatch = useAppDispatch();

  function getIcon(tokenName) {
    const selTkn = coins.find((t) => t.name === tokenName);
    return selTkn ? `${isLP() ? "../" : ""}${selTkn.icon}` : "";
  }

  function isLP() {
    return type && type === "LP" ? true : false;
  }

  const [isListVisible, setListVisible] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState({
    name: pool.byToken,
  });

  const handleCoinClick = (icon, name) => {
    setSelectedCoin({ icon, name });
    toggleVisibility();
    dispatch(setPoolByToken(name));
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
          {selectedCoin.icon && (
            <img src={`/${selectedCoin.icon}`} alt={selectedCoin.name} />
          )}

          <span>{selectedCoin.name}</span>
        </div>
        <img src={DownArrow} alt="Down Arrow" />
      </div>
      <ul className={`selectCoinList ${isListVisible ? "visible" : "hidden"}`}>
        {filterList.map(
          (coin) =>
            coin.name !== selectedCoin.name && (
              <li className="coinItem" key={coin.name}>
                <div
                  className="coinNameIcon"
                  onClick={() => handleCoinClick(coin.icon, coin.name)}
                >
                  {coin.icon && (
                    <img
                      src={`${isLP() ? "../" : "/"}${coin.icon}`}
                      alt={coin.name}
                    />
                  )}

                  <span>{coin.name}</span>
                </div>
              </li>
            ),
        )}
      </ul>
    </div>
  );
}
