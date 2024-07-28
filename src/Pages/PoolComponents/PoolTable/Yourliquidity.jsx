import React, { useEffect, useState } from "react";

import "./Yourliquidity.css";
import { useAppDispatch, useAppSelector } from "../../../hooks/storage";
import Close from "../../../assets/img/close.svg";
import Info from "../../../assets/img/InfoIcons.svg";
import ChainSelectorDropdown from "../ChainSelectorDropdown/ChainSelectorDropdown";
import TokenSelectorBox from "../TokenSelectors/TokenSelectorBox";
import usePool from "../../../hooks/usePool";
import { setPoolBalance } from "../../../store/poolSlice";
import lockAndMintChains from "../../../hooks/chains";

// Hooks
import useBridgeApproveERC20 from "../../../hooks/useBridgeApproveERC20";
import ReactGA from "react-ga";
// Components
import ButtonSpinner from "../../CommonComponents/Spinner/ButtonSpinner";
// Actions
import { setBridgeIsApproving } from "../../../store/bridgeSlice";
import ConnectWalletModal from "../../../HeaderFooterSidebar/ConnectWalletModal";
import { TOKEN_DECIMALS } from "../../../types";
import usePoolAllowance from "../../../hooks/usePoolAllowance";

function Yourliquidity() {
  const [activeButton, setActiveButton] = useState("Deposit");
  const [isYourLiquidityVisible, setYourLiquidityVisible] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [caption, setCaption] = useState("");
  const [showSpinner, setShowSpiner] = useState(false);

  const { approve, isApproveLoading } = useBridgeApproveERC20();
  const { getBalance, stake, withdraw } = usePool();
  const dispatch = useAppDispatch();
  const pool = useAppSelector((state) => state.pool);
  const bridge = useAppSelector((state) => state.bridge);
  usePoolAllowance();

  const handleButtonClick = (buttonType) => {
    setActiveButton(buttonType);
  };

  const handleCloseClick = () => {
    setYourLiquidityVisible(false);
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
        activeButton === "Deposit" ? await stake() : await withdraw();
      }
    }
  };

  useEffect(() => {
    (async () => {
      const _balance = await getBalance(activeButton);
      dispatch(setPoolBalance(_balance));
    })();
  }, [pool.chain, pool.token, activeButton]);

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

      if (pool.balance < pool.amount) {
        setDisabled(true);
        setShowSpiner(false);
        setCaption("Amount exceeds the token balance");
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
  ]);

  const handleBackButtonClick = () => {
    window.history.back();
  };

  return isYourLiquidityVisible ? (
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
              <TokenSelectorBox type={activeButton} />
            </div>
            <ul className="YourliquidityList">
              {/* <li>
                <div className="LiquidityleftText">LPT Available</div>
                <div className="LiquidityrightText">
                  {pool.protocolFee / 10000}%
                </div>
              </li>
              <li>
                <div className="LiquidityleftText">LPT farming</div>
                <div className="LiquidityrightText">
                  {pool.tokenFee / 10000}%
                </div>
              </li> */}
              <li>
                <div className="LiquidityleftText">LPT staked</div>
                <div className="LiquidityrightText">
                  {pool.stakedBalance} {pool.token}
                </div>
              </li>
              <li>
                <div className="LiquidityleftText">Pending Rewards</div>
                <div className="LiquidityrightText">
                  {pool.stakedBalance} {pool.token}
                </div>
              </li>
              <li>
                <div className="LiquidityleftText">Share of Pool</div>
                <div className="LiquidityrightText">
                  {(pool.stakedBalance / (pool.totalSupply / 10 ** 6)) * 100}%
                </div>
              </li>
              {/* <li>
                <div className="LiquidityleftText">Volume (24h)</div>
                <div className="LiquidityrightText">$2,999,236.93</div>
              </li> */}
              <li>
                <div className="LiquidityleftText">Liquidity Pool</div>
                <div className="LiquidityrightText">
                  ${pool.totalSupply / 10 ** 6}
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
  ) : null;
}

export default Yourliquidity;
