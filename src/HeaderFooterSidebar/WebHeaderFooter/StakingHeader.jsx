import React, { useEffect, useState} from "react";
import "./WebHeader.css";
import { useAccount } from "wagmi";
import { useAppSelector } from "../../hooks/storage";
import { useAppKit } from '@reown/appkit/react';
import { modal } from "../../App";
import { findChainfromName } from "../../utils";
import useTabVisibility from "../../hooks/useTabVisibility";
import Logo1 from "../../assets/img/web/logo.svg";
import Logo2 from "../../assets/img/web/logo-2.svg";
import LogoMob from "../../assets/img/web/logo-mob.svg";
// import HeaderNotify from "./HeaderComponents/HeaderNotify";
// import HeaderNewBtns from "./HeaderComponents/HeaderNewBtns";
// import HeaderRightBtn from "./HeaderComponents/HeaderRightBtn";
function StakingHeader() {
  const { isConnected, account } = useAccount();
  const { open } = useAppKit();
  const isMobile = window.innerWidth <= 768;
  const staking = useAppSelector(state => state.staking);
  const isStaking = window.location.href.includes("/staking");
  const {isTabActive} = useTabVisibility();

  const [caption, setCaption] = useState("Connect Wallet")

  const stakingChain = "bscTestnet";

  const onLickHandler = () => {
    open();
  }

  useEffect(() => {

    if(staking.staker){
      setCaption(`${staking.staker.slice(0,6)}...${staking.staker.slice(38,)}`)
    } else {
      setCaption("Connect Wallet")
    }

  }, [staking.staker])

  useEffect(() => {
    if(isTabActive && isStaking && modal.getChainId() !== 97){
      // modal.switchNetwork(findChainfromName(stakingChain));
      modal.switchNetwork({id:97});
    }
  }, [isConnected, account, modal.getChainId()]);

  return (
    <header className="webHeader">
      {/* <HeaderNotify /> */}
      <div className="headerBottomContainer">
        <div className="container">
          <div className="navArea">
            <div className="navBrand">
              {isMobile ? null : (
                <a href="./">
                  <img src={Logo1} className="logo-1" alt="Emmet Logo" />
                  <img src={Logo2} className="logo-2" alt="Emmet Logo" />
                </a>
              )}
              <a href="./" className="mobLogo">
                <img src={LogoMob} alt="Emmet Logo" className="" />
              </a>
            </div>
            <div className="headerRIght">
              <button 
                className="walletConnect connectWallet connectWalletBlack"
                style={{color:"#fff"}}
                onClick={onLickHandler}
                >
              {
                caption
              }
              <img src="/img/chain/bsc.svg" alt="BSC" className="walletIcon" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default StakingHeader;
