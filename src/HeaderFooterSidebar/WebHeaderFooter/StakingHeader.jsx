import React, { useEffect, useState} from "react";
import TokenSaleButton  from "./HeaderComponents/TokenSaleButton"
import "./WebHeader.css";

import { useAppSelector } from "../../hooks/storage";
import { useAppKit } from '@reown/appkit/react';
import LogoMob from "../../assets/img/web/logo-mob.svg";
// import HeaderNotify from "./HeaderComponents/HeaderNotify";
// import HeaderNewBtns from "./HeaderComponents/HeaderNewBtns";
// import HeaderRightBtn from "./HeaderComponents/HeaderRightBtn";
function StakingHeader() {
  
  const { open } = useAppKit();
  const isMobile = window.innerWidth <= 768;
  const staking = useAppSelector(state => state.staking);
  

  const [caption, setCaption] = useState("Connect Wallet")

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

  return (
    <header className="webHeader">
      {/* <HeaderNotify /> */}
      <div className="headerBottomContainer">
        <div className="container">
          <div className="navArea">
            <div className="navBrand">
              <a href="./" className="mobLogo">
                <img src={LogoMob} alt="Emmet Logo" className="" />
              </a>
            </div>
            <div className="headerRIght">
              <TokenSaleButton/>
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
