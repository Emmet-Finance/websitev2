import React, { useState, useEffect, useRef } from "react";
import { useConfig, useSwitchChain, useChainId } from "wagmi";

import DownArrow from "../assets/img/down-white.svg";
import chainData from "../data/lockAndMintChain.json";
import ReactGA from "react-ga";
import { useAppSelector, useAppDispatch } from "../hooks/storage";
import { setBridgeFromChain, setBridgeAmount } from "../store/bridgeSlice";
import { setSwapFromChain } from "../store/swapSlice";
import { isMobile } from "react-device-detect";
import { CHAIN_NAME_TO_ID, ChainNameToTypeChainName } from "../types";
import { setPoolChain } from "../store/poolSlice";

const findChain = (chainId) => {
  return chainData.find((c) => chainId && chainId === c.id);
};

export default function ConnectionIndicatorDropdown({ parent, direction }) {
  const chainId = useChainId();

  const { switchChain } = useSwitchChain();

  // Global State
  const bridge = useAppSelector((state) => state.bridge);

  const dispatch = useAppDispatch();

  const isLayer2View = () =>
    window.location.href.includes("/your-liquidity") ||
    window.location.href.includes("/transactionDetails/");

  const isExplorer = () => window.location.href.includes("/explorer");

  // Local State
  const [selectedChain, setSelectedChain] = useState({
    icon:
      chainId && findChain(chainId)
        ? `${isLayer2View() ? ".." : ""}${findChain(chainId).icon}`
        : chainData[1].icon,
    name:
      chainId && findChain(chainId)
        ? findChain(chainId).name
        : chainData[1].name,
  });

  const [chainArray, setChainArray] = useState(chainData);

  useEffect(() => {
    setChainArray(
      chainData.filter((chain) => chain.name !== selectedChain.name),
    );
  }, [selectedChain, bridge.toChain]);

  const [isListVisible, setListVisible] = useState(false);

  function dispatchChain(name) {
    switch (parent) {
      case "bridge":
        dispatch(setBridgeFromChain(name));
        dispatch(setPoolChain(name));
        setChainArray(chainData);
        break;
      case "swap":
        dispatch(setSwapFromChain(name));
        setChainArray(chainData);
        break;
      case "lock-and-mint":
        dispatch(setBridgeFromChain(name));
        dispatch(setPoolChain(name));
        setChainArray(chainData);
        break;
      case "explorer":
        break;
      default:
    }
  }

  useEffect(() => {
    if (parent === "lock-and-mint") {
      // setChainArray(chainArray);
      const oldBridgeAmount = bridge.amount;
      dispatch(setBridgeAmount(0));
      dispatch(setBridgeAmount(oldBridgeAmount));
    }
  }, [bridge.toChain]);

  useEffect(() => {
    const selChain = findChain(
      CHAIN_NAME_TO_ID[ChainNameToTypeChainName[bridge.fromChain]],
    );
    if (!selChain) {
      setSelectedChain({
        icon: chainData[1].icon,
        name: chainData[1].name,
      });
      dispatchChain(chainData[1].name);
    }
    if (bridge.fromChain) {
      if (selChain) {
        setSelectedChain({
          icon: selChain.icon,
          name: selChain.name,
        });
        dispatchChain(selChain.name);
      }
    }
  }, [bridge.fromChain]);

  useEffect(() => {
    const selChain = findChain(chainId);
    if (selChain) {
      setSelectedChain({
        icon: selChain.icon,
        name: selChain.name,
      });
      dispatchChain(selChain.name);
    }
  }, [chainId]);

  const handleChainClick = (icon, name, id) => {
    setSelectedChain({ icon, name });
    dispatchChain(name);
    toggleVisibility();
    if (parent != "explorer") {
      switchChain({ chainId: id });
    }
    ReactGA.event({
      category: "User",
      action: "Clicked Button",
      label: "Select a Swap Chain",
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

  const componentStyles =
    isExplorer() && isMobile
      ? {
          bottom: 0,
          position: "fixed",
          zIndex: 111,
          left: 0,
          right: 0,
          top: "unset",
          borderRadius: "16px 16px 0px 0px",
          borderTop: "1px solid #3C3F43",
          background: "#1B1D20",
          maxHeight: "50vh",
          overflow: "auto",
        }
      : {
          bottom: 83,
          zIndex: 111,
          // left: 0,
          // right: 0,
          // top: "unset",
          borderRadius: "8px",
          borderTop: "1px solid #3C3F43",
          background: "#1B1D20",
          maxHeight: "50vh",
          // overflow: "auto",
          height: chainArray.length * 44 + 15,
        };

  return (
    <div className="selectCoinLeft" ref={selectCoinRef}>
      <div className="selectedCoin" onClick={toggleVisibility}>
        <div className="coinNameIcon">
          <img
            src={`${isLayer2View() ? "../" : ""}${selectedChain.icon}`}
            alt={selectedChain.name}
            width="30px"
          />
          <span>{selectedChain.name}</span>
        </div>
        <img src={DownArrow} alt="Down Arrow" />
      </div>
      <ul
        className={`selectCoinList
            ${isListVisible ? "visible" : "hidden"}`}
        style={componentStyles}
      >
        {chainArray.map((chain) => (
          <li className="coinItem" key={chain.id}>
            <div
              className="coinNameIcon"
              onClick={() =>
                handleChainClick(
                  `${isLayer2View() ? "../" : ""}${chain.icon}`,
                  chain.name,
                  chain.id,
                )
              }
            >
              <img
                src={`${isLayer2View() ? "../" : ""}${chain.icon}`}
                alt={chain.name}
                width="30px"
              />
              <span>{chain.name}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
