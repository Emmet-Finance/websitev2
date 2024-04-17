import React, { useEffect, useState } from "react";
import "./Header.css";
import { useLocation } from "react-router-dom";
import ConnectWalletModal from "./ConnectWalletModal";
import ConnectionIndicator from "./ConnectionIndicator";
import ExplorerHeaderSearch from "./ExplorerHeaderSearch";
import Wallet from "../assets/img/Wallet.svg";

function Header({ caption }) {
  const location = useLocation();
  const [modalIsOpen, setModalIsOpen] = React.useState(false);

  // Check if the current path matches either "/explorer" or "/pool"
  const isExplorerOrPool =
    location.pathname === "/explorer" || location.pathname === "/pool";

  return (
    <header id="header">
      <div className="container">
        <div className="headerNave">
          <h1 className="siteTitle">{caption}</h1>
          {isExplorerOrPool && <ExplorerHeaderSearch />}
          <div className="headerRightSide">
            <ConnectionIndicator />
            <div
              className="connectWallet"
              onClick={() => setModalIsOpen(!modalIsOpen)}
            >
              <div>
                <img src={Wallet} alt="Wallet" />
                Connect
              </div>
            </div>
            <ConnectWalletModal
              modalIsOpen={modalIsOpen}
              setModalIsOpen={setModalIsOpen}
            />
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
