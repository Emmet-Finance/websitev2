import React from "react";
import { useSwitchChain } from "wagmi";
import "./TokenSwitchButton.css";
import SwitchBtn from "../../../assets/img/Switch-button.svg";
import { useAppSelector, useAppDispatch } from "../../../hooks/storage";
import {
  setBridgeError,
  swapBridgeChainsAndTokens,
} from "../../../store/bridgeSlice";
import { getChainidByName } from "../../../utils/filters";

export default function TokenswitchButton() {
  const bridge = useAppSelector((state) => state.bridge);

  const dispatch = useAppDispatch();

  const onError = () => {
    // If a user rejects or another error occurs
    dispatch(
      setBridgeError("UserRejectedRequestError: User rejected the request."),
    );
    // Revert the swap to its initial state
    dispatch(
      swapBridgeChainsAndTokens({
        fromChain: bridge.toChain,
        toChain: bridge.fromChain,
        fromToken: bridge.toToken,
        toToken: bridge.fromToken,
      }),
    );
  };

  const onSuccess = () => {
    dispatch(setBridgeError(""));
  };

  const { switchChain } = useSwitchChain();

  const handleSwitchButtonClick = async () => {
    
    try {
      // 1. Get the target chain ID
      const id = getChainidByName(bridge.toChain);

      console.log({ id });

      // 2. Swap the chains & tokens in the UI
      dispatch(
        swapBridgeChainsAndTokens({
          fromChain: bridge.toChain,
          toChain: bridge.fromChain,
          fromToken: bridge.toToken,
          toToken: bridge.fromToken,
        }),
      );

      // 3. Swap the from chain in the wallet
      switchChain({ chainId: id });

    } catch (error) {
      dispatch(setBridgeError(`TokenswitchButton Error: ${error.message}`));
    }
  };

  return (
    <button className="switchBtn" onClick={handleSwitchButtonClick}>
      <img src={SwitchBtn} alt="Token Switch Button" />
    </button>
  );
}
