import React, { useState } from "react";
import Logo from "../assets/img/Emmet-logo2.svg";
import OpenNav from "../assets/img/OpenNav.svg";
import CloseNav from "../assets/img/CloseNav.svg";
import MobileNav from "./MobileNav";
import MobileFooterNav from "./MobileFooterNav";
import NetworkSwitch from "../HeaderFooterSidebar/NetworkSwitch/NetworkSwitch";
import ConnectWalletModal from "./ConnectWalletModal";
import ConnectionIndicator from "./LockAndMintConnectionIndicator";
import Wallet from "../assets/img/Wallet.svg";
import { useAppSelector } from "../hooks/storage";
import TokenSaleButton from "../HeaderFooterSidebar/WebHeaderFooter/HeaderComponents/TokenSaleButton";

const MobileHeader = () => {
  // const [isBodyClassAdded, setIsBodyClassAdded] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const bridge = useAppSelector((state) => state.bridge);
  const isStaking = window.location.href.includes("/staking");

  const handleButtonClick = () => {
    // Toggle the class on the body element
    document.body.classList.toggle("activeMobileMenu");
    // Update the state to reflect the current state of the class
    // setIsBodyClassAdded((prev) => !prev);
  };

  return (
    <header className="mobileHeader">
      <div className="mobileHeaderTop">
        <NetworkSwitch />
      </div>

      <div className="mobileHeaderCenter">
        <a href="/">
          <img src={Logo} alt="EmmetFinance" />
        </a>
        <div className="headerRightSide">
          <TokenSaleButton />
          {!isStaking && <ConnectionIndicator />}

          <div
            className="connectWallet"
            onClick={() => setModalIsOpen(!modalIsOpen)}
          >
            <div>
              <img src={Wallet} alt="Wallet" />
              {bridge.senderAddress
                ? `${bridge.senderAddress.slice(0, 3)}...${bridge.senderAddress.slice(
                  -3,
                )}`
                : "Connect"}
            </div>
          </div>
          <div className="mobileNavTriger" onClick={handleButtonClick}>
            <img src={OpenNav} alt="Nav Triger" className="openNav" />
            <img src={CloseNav} alt="Nav Triger" className="closeNav" />
          </div>
          <MobileNav />
        </div>
      </div>
      <ConnectWalletModal
        modalIsOpen={modalIsOpen}
        setModalIsOpen={setModalIsOpen}
      />
      <MobileFooterNav />
    </header>
  );
};

export default MobileHeader;
