import React, { useEffect, useState } from "react";
import { useAppKit } from '@reown/appkit/react'
import { useAccount } from "wagmi";
import { isMobile } from "react-device-detect";
import {
  useTonAddress,
  useTonConnectModal,
  useTonConnectUI,
} from "@tonconnect/ui-react";
import { useAppSelector, useAppDispatch } from "../hooks/storage";
import { setSenderAddress } from "../store/bridgeSlice";
import TonIcon from "../assets/img/ton.svg";
import WalletConnectIcon from "../assets/img/wallet-connect.svg";
// import SolanaIcon from "../assets/img/solana.svg";
import {
  // useConnection as useSolanaConnection,
  useWallet as useSolanaWallet,
} from "@solana/wallet-adapter-react";
// import {
//   WalletDisconnectButton,
//   WalletMultiButton,
//   useWalletModal as useSolanaWalletModal,
// } from "@solana/wallet-adapter-react-ui";

import Modal from "react-modal";
import { modal } from "../App";
import chainList from "../data/lockAndMintChain.json";

Modal.setAppElement("#root");

export default function ConnectWalletModal({ modalIsOpen, setModalIsOpen }) {
  // EVM connection:  ------------------------------
  const { open } = useAppKit();

  const { address, isConnected } = useAccount();
  // TON Connection:  ------------------------------
  const {
    state: tonState,
    open: openTonModal,
    close: closeTonModal,
  } = useTonConnectModal();

  // Solana Connection: ------------------------------
  // const solanaWalletModal = useSolanaWalletModal();
  const solanaWallet = useSolanaWallet();

  const bridge = useAppSelector((state) => state.bridge);
  const dispatch = useAppDispatch();
  const tonAddress = useTonAddress();
  const [alertIsOpen, setAlertIsOpen] = useState(false);
  const [alertIsOpenForSolana, setAlertIsOpenForSolana] = useState(false);

  const applyCssToShadowDom = () => {
    var style = document.createElement("style");
    var host = document.querySelector("w3m-modal");
    if (host) {
      // setTimeout(() => {
      style.innerHTML =
        "@media screen and (min-width: 1000px) {.w3m-container {left: 140px;}}";
      host.shadowRoot.appendChild(style);
      // }, 1000);
    }
  };

  const showCharacters = isMobile ? 3 : 6;

  function closeModal() {
    setModalIsOpen(false);
  }

  useEffect(() => {
    dispatch(setSenderAddress(""));
    if (bridge.fromChain === "TON" || bridge.fromChain === "TONTestnet") {
      if (tonAddress) {
        dispatch(setSenderAddress(tonAddress));
      } else {
        dispatch(setSenderAddress(""));
      }
    } else if (
      bridge.fromChain === "Solana" ||
      bridge.fromChain === "SolanaDevnet"
    ) {
      if (solanaWallet?.publicKey) {
        dispatch(setSenderAddress(solanaWallet.publicKey.toString()));
      } else {
        dispatch(setSenderAddress(""));
      }
    } else {
      if (address) {
        dispatch(setSenderAddress(address));
      } else {
        dispatch(setSenderAddress(""));
      }
    }
  }, [address, tonAddress, bridge.fromChain, solanaWallet?.publicKey]);

  return (
    <div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        className="connectWalletModal"
        overlayClassName="connectWalletModalOverlay"
      >
        <div
          className="connectWallet"
          onClick={() => {
            open();
            const chain = chainList.filter(item => item.name.toLowerCase() === bridge.fromChain.toLowerCase())[0];
            if (chain && chain.id !== modal.getChainId()) {
              modal.switchNetwork(chain)
            }
            applyCssToShadowDom();
            closeModal();
          }}
        >
          <div>
            <img src={WalletConnectIcon} alt="Wallet" height={24} />
            {isConnected
              ? `${address.slice(0, showCharacters)}...${address.slice(
                -showCharacters,
              )}`
              : "WalletConnect"}
          </div>
        </div>
        {tonAddress ? (
          <div
            className="connectWallet"
            onClick={() => setAlertIsOpen(true) && closeModal()}
          >
            <div>
              <img src={TonIcon} alt="Wallet" height={24} />
              {`${tonAddress.slice(0, showCharacters)}...${tonAddress.slice(
                -showCharacters,
              )}`}
            </div>
          </div>
        ) : (
          <div
            className="connectWallet"
            onClick={() => openTonModal() && closeModal()}
          >
            <div>
              <img src={TonIcon} alt="Wallet" height={24} />
              TON Connect
            </div>
          </div>
        )}
        {/* {solanaWallet.connected ? (
          <div
            className="connectWallet"
            onClick={() => {
              setAlertIsOpenForSolana(true);
              closeModal();
            }}
          >
            <div>
              <img src={SolanaIcon} alt="Wallet" height={24} width={16} />
              {`${solanaWallet.publicKey
                .toString()
                .slice(0, showCharacters)}...${solanaWallet.publicKey
                .toString()
                .slice(-showCharacters)}`}
            </div>
          </div>
        ) : (
          <div
            className="connectWallet"
            onClick={() => {
              solanaWalletModal.setVisible(true);
              closeModal();
            }}
          >
            <div>
              <img src={SolanaIcon} alt="Wallet" height={24} width={16} />
              Solana Connect
            </div>
          </div>
        )} */}
      </Modal>
      <DisconnectTonModal
        alertIsOpen={alertIsOpen}
        setAlertIsOpen={setAlertIsOpen}
      />
      <DisconnectSolanaModal
        alertIsOpen={alertIsOpenForSolana}
        setAlertIsOpen={setAlertIsOpenForSolana}
      />
    </div>
  );
}

const DisconnectTonModal = ({ alertIsOpen, setAlertIsOpen }) => {
  const tonConnectUi = useTonConnectUI();
  return (
    <div>
      <Modal
        isOpen={alertIsOpen}
        onRequestClose={() => setAlertIsOpen(false)}
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
        <div>Do you want to disconnect TON Wallet?</div>
        <button
          className="disconnectTonButton"
          onClick={() => tonConnectUi[0].disconnect() && setAlertIsOpen(false)}
        >
          <div>Disconnect</div>
        </button>
      </Modal>
    </div>
  );
};

const DisconnectSolanaModal = ({ alertIsOpen, setAlertIsOpen }) => {
  const solanaWallet = useSolanaWallet();
  return (
    <div>
      <Modal
        isOpen={alertIsOpen}
        onRequestClose={() => setAlertIsOpen(false)}
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
        <div>Do you want to disconnect Solana Wallet?</div>
        <button
          className="disconnectTonButton"
          onClick={() => solanaWallet.disconnect() && setAlertIsOpen(false)}
        >
          <div>Disconnect</div>
        </button>
      </Modal>
    </div>
  );
};
