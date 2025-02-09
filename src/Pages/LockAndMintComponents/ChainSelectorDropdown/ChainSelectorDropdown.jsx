import React, { useState, useEffect, useRef } from "react";
import { useSwitchChain, useChainId } from "wagmi";
import DownArrow from "../../../assets/img/down-white.svg";
import ReactGA from "react-ga";
import { useAppSelector, useAppDispatch } from "../../../hooks/storage";
import {
  setBridgeFromChain,
  setBridgeAmount,
  setBridgeIsTransferFromLp,
  setBridgeReceive,
} from "../../../store/bridgeSlice";
import { setSwapFromChain } from "../../../store/swapSlice";
import {
  CHAIN_NAME_TO_ID,
  ChainNameToTypeChainName,
  ChainToDestinationDomain,
} from "../../../types";
import { chainFactory } from "../../../store/chainFactory";
import { findChain, findChainByName, isLayer2View } from "../../../utils";


export default function ChainSelectorDropdown({ parent, direction }) {
  const chainId = useChainId();

  const { switchChain } = useSwitchChain();

  // Global State
  const bridge = useAppSelector((state) => state.bridge);

  const dispatch = useAppDispatch();

  // Local State
  const [selectedChain, setSelectedChain] = useState();

  useEffect(() => {
    (async () => {
      if (
        bridge.fromChain &&
        bridge.toChain &&
        bridge.fromToken &&
        bridge.toToken
      ) {
        try {
          const handler = await chainFactory.inner(
            ChainToDestinationDomain[
              ChainNameToTypeChainName[bridge.fromChain]
            ],
          );
          const isTransferFromLp = await handler.isTransferFromLp(
            CHAIN_NAME_TO_ID[ChainNameToTypeChainName[bridge.toChain]],
            bridge.fromToken,
            bridge.toToken,
          );
          dispatch(setBridgeIsTransferFromLp(isTransferFromLp));
        } catch (error) {
          dispatch(setBridgeIsTransferFromLp(false));
        }
      }
    })();
  }, [bridge.fromChain, bridge.toChain, bridge.fromToken, bridge.toToken]);

  useEffect(() => {
    if (bridge.amount) {
      dispatch(setBridgeReceive(bridge.amount - bridge.tokenFee));
    } else {
      dispatch(setBridgeReceive(""));
    }
  }, [bridge.amount, bridge.tokenFee]);

  const [isListVisible, setListVisible] = useState(false);

  function dispatchChain(name) {
    switch (parent) {
      case "bridge":
        dispatch(setBridgeFromChain(name));
        break;
      case "swap":
        dispatch(setSwapFromChain(name));
        break;
      case "lock-and-mint":
        dispatch(setBridgeFromChain(name));
        break;
      case "explorer":
        dispatch(setBridgeFromChain(name));
        break;
      default:
        dispatch(setBridgeFromChain(name));
    }
  }

  useEffect(() => {
    if (parent === "lock-and-mint") {
      const oldBridgeAmount = bridge.amount;
      dispatch(setBridgeAmount(0));
      dispatch(setBridgeAmount(oldBridgeAmount));
    }
  }, [bridge.toChain]);


  useEffect(() => {
    const selChain = findChain(chainId);
    if (selChain) {
      dispatchChain(selChain.name);
    }
  }, [chainId]);

  useEffect(() => {
    const selChain = findChainByName(bridge.fromChain);
    if (selChain) {
      setSelectedChain({
        icon: selChain.icon,
        name: selChain.name,
      });
    }
  }, [bridge.fromChain]);

  const handleChainClick = (icon, name, id) => {
    setSelectedChain({ icon, name });
    dispatchChain(name);
    toggleVisibility();
    switchChain({ chainId: id });
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

  // const componentStyles =
  //   isExplorer() && isMobile
  //     ? {
  //         bottom: 0,
  //         position: "fixed",
  //         zIndex: 111,
  //         left: 0,
  //         right: 0,
  //         top: "unset",
  //         borderRadius: "16px 16px 0px 0px",
  //         borderTop: "1px solid #3C3F43",
  //         background: "#1B1D20",
  //         maxHeight: "50vh",
  //         overflow: "auto",
  //       }
  //     : {
  //         bottom: 83,
  //         zIndex: 111,
  //         // left: 0,
  //         // right: 0,
  //         // top: "unset",
  //         borderRadius: "8px",
  //         borderTop: "1px solid #3C3F43",
  //         background: "#1B1D20",
  //         maxHeight: "50vh",
  //         // overflow: "auto",
  //         // height: chainArray.length * 44 + 15,
  //       };

  return (
    <div className="selectCoinLeft" ref={selectCoinRef}>
      <div className="selectedCoin" onClick={toggleVisibility}>
        {selectedChain && (
          <div className="coinNameIcon">
            <img
              src={`${isLayer2View() ? "../" : ""}${selectedChain.icon}`}
              alt={selectedChain.name}
              width="30px"
            />
            <span>{selectedChain.name}</span>
          </div>
        )}

        <img src={DownArrow} alt="Down Arrow" />
      </div>
      <ul
        className={`selectCoinList
            ${isListVisible ? "visible" : "hidden"}`}
        // style={componentStyles}
      >
        {bridge.fromChains.map((chain) => (
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
