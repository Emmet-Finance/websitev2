import React, { useEffect, useState } from "react";
// Hooks
import { useAccount } from "wagmi";
import { useAppSelector, useAppDispatch } from "../../hooks/storage";
import useBridgeApproveERC20 from "../../hooks/useBridgeApproveERC20";
import useBridgeTransferEmmet from "../../hooks/useBridgeTransferEmmet";
import useBalance from "../../hooks/useBalance";
import ReactGA from "react-ga";
// Components
import ButtonSpinner from "../CommonComponents/Spinner/ButtonSpinner";
// Actions
import { setBridgeIsApproving } from "../../store/bridgeSlice";
import ConnectWalletModal from "../../HeaderFooterSidebar/ConnectWalletModal";
import { useTonWallet } from "@tonconnect/ui-react";
import lockAndMintChains from "../../hooks/chains";
import { Address } from "@ton/core";
import Modal from "react-modal";
import { useWallet } from "@solana/wallet-adapter-react";

const pattern = /^[0x]{0,2}[0-9a-fA-F]{0,40}$/;

function isValidTonAddress(str) {
  try {
    Address.parse(str);
    return true;
  } catch (e) {
    return false;
  }
}

function MainActionButton() {
  const dispatch = useAppDispatch();
  const bridge = useAppSelector((state) => state.bridge);
  const { fromBalance } = useBalance();

  const { isConnected } = useAccount();
  const wallet = useTonWallet();
  const solanaWallet = useWallet();

  // const {allowance, isApprovalRequired} = useBridgeAllowance();

  const [disabled, setDisabled] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [caption, setCaption] = useState("");
  const [showSpinner, setShowSpiner] = useState(false);
  const { approve, isApproveLoading } = useBridgeApproveERC20();
  const { isTransferProcessed, sendInstallment } = useBridgeTransferEmmet();
  const [msg, setMsg] = useState("");
  const [alertIsOpen, setAlertIsOpen] = useState(false);

  function isApproveRequired() {
    const chainRequiresApproval = lockAndMintChains.find(
      (chain) => chain.name.toLowerCase() === bridge.fromChain.toLowerCase(),
    )?.requiresApproval;

    if (chainRequiresApproval) {
      const needApproval =
        Number(bridge.amount) >
        Number(bridge.allowance) / 10 ** Number(bridge.decimals);
      return needApproval;
    }
  }

  useEffect(() => {
   
    if (isConnected 
      || wallet?.account 
      || solanaWallet.publicKey
    ) {
      if (!bridge.amount || Number(bridge.amount) <= 0) {
        setDisabled(true);
        setCaption("Enter Amount");
        setShowSpiner(false);
      }

      if (isApproveRequired()) {
        setDisabled(false);
        setCaption("Approve");
        setShowSpiner(false);
      }

      if (isApproveLoading) {
        setDisabled(true);
        setShowSpiner(true);
      }

      if (bridge.amount && !isApproveRequired()) {
        setDisabled(false);
        setCaption("Transfer");
        setShowSpiner(false);
      }

      if (fromBalance < bridge.amount) {
        setDisabled(true);
        setShowSpiner(false);
        setCaption("Amount exceeds the token balance");
      }

      if (isTransferProcessed) {
        setDisabled(true);
        setShowSpiner(true);
        setCaption("Processing Transfer...");
      }
    } else {
      setDisabled(false);
      setCaption("Connect wallet");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isConnected,
    bridge.amount,
    isApproveLoading,
    isTransferProcessed,
    wallet,
    fromBalance,
    solanaWallet.publicKey,
    bridge.allowance,
  ]);

  const onClickSelectAction = async () => {
    if (!isConnected && !wallet?.account) {
      setModalIsOpen(true);
    } else {
      if (!bridge.receiver) {
        setAlertIsOpen(true);
        setMsg("Receiver address is empty");
        return;
      }

      if (bridge.toChain !== "TON" && bridge.toChain !== "TONTestnet") {
        if (!pattern.test(bridge.receiver)) {
          setAlertIsOpen(true);
          setMsg("Receiver address is invalid");
          return;
        }
      } else {
        if (!isValidTonAddress(bridge.receiver)) {
          setAlertIsOpen(true);
          setMsg("Receiver address is invalid");
          return;
        }
      }

      if (isApproveRequired()) {
        if (approve) {
          try {
            ReactGA.event({
              category: "User",
              action: "Clicked Button",
              label: "Approve",
            });

            approve();
            dispatch(setBridgeIsApproving(true));
          } catch (error) {
            console.warn(error.message);
            dispatch(setBridgeIsApproving(false));
          }
        }
      } else {
        ReactGA.event({
          category: "User",
          action: "Clicked Button",
          label: "Transfer",
        });
        sendInstallment();
      }
    }
  };

  return (
    <div className="connectBtn">
      <AlertModal
        msg={msg}
        alertIsOpen={alertIsOpen}
        setAlertIsOpen={setAlertIsOpen}
      />
      <button
        className="MainActionButton"
        disabled={disabled}
        onClick={onClickSelectAction}
      >
        {showSpinner && <ButtonSpinner />}
        {caption || "Enter amount"}
      </button>
      <ConnectWalletModal
        modalIsOpen={modalIsOpen}
        setModalIsOpen={setModalIsOpen}
      />
    </div>
  );
}

const AlertModal = ({ msg, alertIsOpen, setAlertIsOpen }) => {
  return (
    <div>
      <Modal
        isOpen={alertIsOpen}
        onRequestClose={() => setAlertIsOpen(false)}
        // style={customStyles}
        contentLabel="Example Modal"
        className="alertModal whiteBorder"
        overlayClassName="alertModalOverlay"
      >
        <div className="alertModalHeader">
          <h4 className="alertModalTitle">Alert</h4>
          <button
            className="alertModalCloseBtn"
            onClick={() => setAlertIsOpen(false)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="#fff"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div>{msg}</div>
      </Modal>
    </div>
  );
};

export default MainActionButton;
