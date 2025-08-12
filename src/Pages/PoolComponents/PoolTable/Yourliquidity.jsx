import React, { useEffect, useState } from "react";

import "./Yourliquidity.css";
import { useAppDispatch, useAppSelector } from "../../../hooks/storage";
import Close from "../../../assets/img/close.svg";
import Info from "../../../assets/img/InfoIcons.svg";
import ChainSelectorDropdown from "../ChainSelectorDropdown/ChainSelectorDropdown";
import TokenSelectorBox from "../TokenSelectors/TokenSelectorBox";
import usePool from "../../../hooks/usePool";
import {
  setPoolAmount,
  setPoolChain,
  setPoolToken,
} from "../../../store/poolSlice";
import lockAndMintChains from "../../../hooks/chains";

// Hooks
import useBridgeApproveERC20 from "../../../hooks/useBridgeApproveERC20";
import ReactGA from "react-ga";
// Components
import ButtonSpinner from "../../CommonComponents/Spinner/ButtonSpinner";
// Actions
import {
  setBridgeFromChain,
  setBridgeIsApproving,
} from "../../../store/bridgeSlice";
import ConnectWalletModal from "../../../HeaderFooterSidebar/ConnectWalletModal";
import { TOKEN_DECIMALS } from "../../../types";
import usePoolAllowance from "../../../hooks/usePoolAllowance";
import { useLocation } from "react-router-dom";
import { useSwitchChain } from "wagmi";
import usePoolData from "../../../hooks/usePoolData";

function Yourliquidity() {
  const [activeButton, setActiveButton] = useState("Deposit");
  const [disabled, setDisabled] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [caption, setCaption] = useState("");
  const [showSpinner, setShowSpiner] = useState(false);

  const { approve, isApproveLoading } = useBridgeApproveERC20();
  const { stake, withdraw, withdrawFees } = usePool();
  const dispatch = useAppDispatch();
  const pool = useAppSelector((state) => state.pool);
  const bridge = useAppSelector((state) => state.bridge);
  const location = useLocation();
  const { switchChain } = useSwitchChain();
  usePoolAllowance();
  usePoolData()

  const handleButtonClick = (buttonType) => {
    setActiveButton(buttonType);
  };

  function isApproveRequired() {
    const chainRequiresApproval = lockAndMintChains.find(
      (chain) => chain.name === pool.chain,
    )?.requiresApproval;
    if (chainRequiresApproval && activeButton === "Deposit") {
      const needApproval =
        Number(pool.amount) >
        Number(pool.allowance) / 10 ** Number(TOKEN_DECIMALS[pool.token]);
      return needApproval;
    }
  }

  const onClickSelectAction = async () => {
    if (!bridge.senderAddress) {
      setModalIsOpen(true);
    } else {
      if (isApproveRequired()) {
        if (approve) {
          try {
            ReactGA.event({
              category: "User",
              action: "Clicked Button",
              label: "Approve",
            });

            approve(true);
            dispatch(setBridgeIsApproving(true));
          } catch (error) {
            console.warn(error.message);
            dispatch(setBridgeIsApproving(false));
          }
        }
      } else {
        setDisabled(true);
        setShowSpiner(true);
        activeButton === "Deposit"
          ? setCaption("Depositing")
          : setCaption("Withdrawing");
        activeButton === "Deposit" ? await stake() : await withdraw();
        setShowSpiner(false);
        setDisabled(false);
        dispatch(setPoolAmount(""));
      }
    }
  };

  useEffect(() => {
    if (location.state) {
      dispatch(setPoolChain(location.state.chain));
      dispatch(setBridgeFromChain(location.state.chain));
      dispatch(setPoolToken(location.state.token));
    }
  }, [location.state]);

  useEffect(() => {
    if (bridge.senderAddress) {
      if (!pool.amount || Number(pool.amount) <= 0) {
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

      if (pool.amount && !isApproveRequired()) {
        setDisabled(false);
        setCaption(activeButton);
        setShowSpiner(false);
      }

      if(activeButton === "Deposit"){
        if (pool.balance < pool.amount) {
          setDisabled(true);
          setShowSpiner(false);
          setCaption("Amount exceeds the token balance");
        }
      } else {
        if(pool.stakedBalance < pool.amount){
          setDisabled(true);
          setShowSpiner(false);
          setCaption("Amount exceeds the token balance");
        }
      }

    } else {
      setDisabled(false);
      setCaption("Connect wallet");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    bridge.senderAddress,
    bridge.amount,
    isApproveLoading,
    pool.amount,
    pool.balance,
    pool.allowance,
    activeButton,
  ]);

  const handleBackButtonClick = () => {
    window.history.back();
  };

  return (
    <>
      <div className="yourliquidityArea">
        <div className="yourliquidity">
          <div className="YourliquidityTop">
            <h2>Your liquidity</h2>
            <img
              src={Close}
              alt="Close"
              className="closeLiquidity"
              onClick={handleBackButtonClick}
            />
          </div>
          <div className="toggleLiquidity">
            <button
              className={`depositeToggle ${
                activeButton === "Deposit" ? "active" : ""
              }`}
              onClick={() => handleButtonClick("Deposit")}
            >
              Deposit
            </button>
            <button
              className={`withdrawToggle ${
                activeButton === "Withdraw" ? "active" : ""
              }`}
              onClick={() => handleButtonClick("Withdraw")}
            >
              Withdraw
            </button>
          </div>
          <div className="YourliquidityContainer">
            <div className="YourliquidityChain">
              <ChainSelectorDropdown parent={"LP"} />
              <div className="YourliquidityChainApy">
                <p>
                  APY{" "}
                  <button className="copyLink">
                    <span className="copyHover YourliquidityChainApyHoverText">
                      Calculations based on data from the past 30 days,
                      extrapolated to a year.
                    </span>
                    <img src={Info} alt="Info" />
                  </button>
                </p>{" "}
                <span>{pool.apy}%</span>
              </div>
            </div>
            <div className="yourliquidityInput">
              <TokenSelectorBox
                type={activeButton}
                activeButton={activeButton}
              />
            </div>
            <ul className="YourliquidityList">
              <li>
                <div className="LiquidityleftText">LPT staked</div>
                <div className="LiquidityrightText">
                  {pool.stakedBalance} {pool.token}
                </div>
              </li>

              <li>
                <div className="LiquidityleftText">Share of Pool</div>
                <div className="LiquidityrightText">
                  {bridge.senderAddress &&
                  pool.stakedBalance &&
                  pool.totalSupply
                    ? ((pool.stakedBalance / pool.totalSupply) * 100).toFixed(2)
                    : "0.00"}
                  %
                </div>
              </li>
              {/* <li>
                <div className="LiquidityleftText">Volume (24h)</div>
                <div className="LiquidityrightText">$2,999,236.93</div>
              </li> */}
              <li>
                <div className="LiquidityleftText">Liquidity Pool</div>
                <div className="LiquidityrightText">
                  {pool.liquidityPoolInUSD} {pool.token}
                </div>
              </li>
            </ul>
            <div className="connectBtn">
              <button
                type="button"
                className="MainActionButton"
                disabled={disabled}
                onClick={onClickSelectAction}
              >
                {showSpinner && <ButtonSpinner />}
                {caption}
              </button>
              <ConnectWalletModal
                modalIsOpen={modalIsOpen}
                setModalIsOpen={setModalIsOpen}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Yourliquidity;
