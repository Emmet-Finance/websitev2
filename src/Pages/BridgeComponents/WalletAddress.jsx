import React, { useEffect, useState } from "react";
import { setReceiver } from "../../store/bridgeSlice";
import { useAppSelector, useAppDispatch } from "../../hooks/storage";
import { isMobile } from "react-device-detect";
import { isEvmAddress, isValidTonAddress, truncateAddress } from "../../verifiers";
import useBridgeAccounts from "../../hooks/useBridgeAccounts";

function WalletAddress() {
  const showDigits = isMobile ? 10 : 14;
  const dispatch = useAppDispatch();
  const bridge = useAppSelector((state) => state.bridge);

  const { 
    evmAccount, 
    solanaWallet, 
    tonAddress, 
    toProtocol
   } = useBridgeAccounts();

  //  L O C A L  S T O R A G E
  const [invalidAddress, setInvalidAddress] = useState(false);
  const [showAddress, setShowAddress] = useState(truncateAddress(bridge.receiver, showDigits, showDigits));
  const [isChangeVisible, setIsChangeVisivle] = useState(true);

  function setEmptyReceiver() {
    setShowAddress("");
    dispatch(setReceiver(""));
  }

  useEffect(() => { // SET DESTINATION ADDRESS DISPLAY
    if (bridge.receiver) {
      setShowAddress(truncateAddress(bridge.receiver, showDigits, showDigits));
      setIsChangeVisivle(true);
    }

  }, [bridge.receiver,toProtocol]);

  function onChangeClickHandle(e) {
    e.preventDefault();
    const inputValue = e.target.value;

    console.log("inputValue", inputValue, "isEvmAddress", isEvmAddress(inputValue), toProtocol)

    switch (toProtocol) {
      case "TON":
        if (isValidTonAddress(inputValue)) {
          setInvalidAddress(false);
          setIsChangeVisivle(true);
          setShowAddress(truncateAddress(inputValue, showDigits, showDigits));
          dispatch(setReceiver(inputValue));
        } else {
          setInvalidAddress(true);
          setEmptyReceiver();
        }
        break;
      // case "SOLANA":
      //   if (isValidSolanaAddress(inputValue)) {
      //     setInvalidAddress(false);
      //     setIsChangeVisivle(true);
      //     setShowAddress(truncateAddress(inputValue, showDigits, showDigits));
      //     dispatch(setReceiver(inputValue));
      //   } else {
      //     setInvalidAddress(true);
      //     setEmptyReceiver();
      //   }
      //   break;
      case "EVM":
        if (isEvmAddress(inputValue)) {
          setInvalidAddress(false);
          setIsChangeVisivle(true);
          setShowAddress(truncateAddress(inputValue, showDigits, showDigits));
          dispatch(setReceiver(inputValue));
        } else {
          setInvalidAddress(true);
          setEmptyReceiver();
        }
        break;
      default:
        setInvalidAddress(true);
        setEmptyReceiver();
        break;
    }

  }

  function onChangeClick() {
    setEmptyReceiver();
    setInvalidAddress(false);
    setIsChangeVisivle(false);
  }

  return (
    <>
      {evmAccount && evmAccount.isConnected || tonAddress || solanaWallet.publicKey ? (
        <div className="wallet_Address">
          <div className="inputAddress Disenable">
            <input
              onChange={onChangeClickHandle}
              value={showAddress}
              type="text"
              className={`${invalidAddress && "redBorder"}`}
              placeholder="Paste the receiver address"
            // style={{"textAlign":"center"}}
            />
          </div>
          <button
            className="changeAddress"
            onClick={onChangeClick}
            hidden={!isChangeVisible}
          >
            Change
          </button>
        </div>
      ) : (
        ""
      )}
    </>
  );
}

export default WalletAddress;
