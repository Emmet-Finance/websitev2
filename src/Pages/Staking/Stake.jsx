import React, { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../hooks/storage';
import ButtonSpinner from "../CommonComponents/Spinner/ButtonSpinner";
import useStaking from "../../hooks/useStaking";
import { setAmount, setPeriod } from "../../store/stakingSlice";
import { modal } from "../../App";
import { findChainfromName } from "../../utils";
import { useAccount } from "wagmi";
import useTabVisibility from "../../hooks/useTabVisibility";
import TokenSelector from "./TokenSelector";
import ZeroFeeBanner from "./ZeroFeesBanner";

const insufficientBalance = "Insufficient balance"
const captionApprove = "Approve";
const captionStake = "Stake";
const connectWallet = "Connect your BSC wallet";
const captionEnterAmount = "Enter Amount";
const captionPending = "Processing...";

function Stake() {
  const staking = useAppSelector(state => state.staking);
  const dispatch = useAppDispatch();
  const { approve, isAwaiting, txHash, stake } = useStaking();
  const isStaking = window.location.href.includes("/staking");
    const {isTabActive} = useTabVisibility();
    const { isConnected, account } = useAccount();

  // State to track the active staking item
  const [activeItem, setActiveItem] = useState(3);
  const [caption, setCaption] = useState(captionEnterAmount);
  const [disabled, setDisabled] = useState(false);
  const [amount, setStakeAmount] = useState("");
  const [oldAmount, setOldAmount] = useState("");

  // Function to handle item click
  const handleItemClick = (index) => {
    setActiveItem(index);
    dispatch(setPeriod(index));
  };

  const inputStakeChange = (e) => {
    e.preventDefault();
    let inputValue = e.target.value.replace(/\D/g, "");
    if (inputValue) {
      setStakeAmount(Number(inputValue).toFixed(0));
    } else {
      setStakeAmount("");
      setOldAmount("");
    }
  }

  const maxClickHandle = () => {
    dispatch(setAmount(staking.balance));
  }

  useEffect(() => {
    if(isTabActive && isStaking && modal.getChainId() !== 56){
      // modal.switchNetwork(findChainfromName(stakingChain));
      modal.switchNetwork(findChainfromName("BSC"));
    }
  }, [isConnected, account, modal.getChainId()]);

  useEffect(() => {
    if (amount) {
      setOldAmount(amount);
      dispatch(setAmount(amount))
    } else {
      dispatch(setAmount(oldAmount))
    }
  }, [amount]);

  useEffect(() => {

    if (!staking.staker) {
      setCaption(connectWallet);
      setDisabled(true);
    } else if (isAwaiting) {
      setCaption(captionPending);
      setDisabled(true);
    } else if (!staking.amount) {
      setCaption(captionEnterAmount);
      setDisabled(true);
    } else if (staking.amount > staking.balance) {
      setCaption(insufficientBalance);
      setDisabled(true);
    } else if (Number(staking.amount) > Number(staking.allowance)) {
      setCaption(captionApprove);
      setDisabled(false);
    } else {
      setCaption(captionStake);
      setDisabled(false);
    }

  }, [staking.staker, staking.amount, staking.allowance, staking.balance, isAwaiting]);

  const switchAction = async () => {
    switch (caption) {
      case captionApprove:
        approve(staking.amount);
        break;
      case captionStake:
        stake();
        break;
      default:
        break;
    }
  }

  return (
    <div className="stake stakeBox">
      <div className="stakeHeader">Stake 
        <TokenSelector />
      </div>
      <div className="stakeBody">
        <div className="emmentAmount">
          <div className="emmentAmountTitle">
            <p className="grayText">Enter ${staking.token} amount</p>
            <h4>{staking.balance ? staking.balance.toLocaleString() : 0} {staking.token} Available</h4>
          </div>
          <div className="enter_amount">
            <input
              type="number"
              value={staking.amount ? staking.amount : ""}
              placeholder=""
              onChange={e => inputStakeChange(e)}
            />
            <span
              className="max_amount"
              onClick={maxClickHandle}
              style={{ cursor: "pointer" }}
            >MAX</span>
          </div>
        </div>
        <div className="selectStaking">
          <p className="grayText">Select staking period</p>
          <ul className="stakingList">
            {[
              { duration: "3 months", apy: "24%" },
              { duration: "6 months", apy: "32%" },
              { duration: "9 months", apy: "40%" },
              { duration: "1 year", apy: "50%" },
            ].map((item, index) => (
              <li
                key={index}
                className={`stakingItem ${activeItem === index ? "active" : ""}`}
                onClick={() => handleItemClick(index)}
              >
                {item.duration} <br /> APY {item.apy}
                {/* Conditionally render the checkmark image */}
                {activeItem === index && (
                  <img src="/img/check-one.svg" alt="Check" className="stakeCheck" />
                )}
              </li>
            ))}
          </ul>
          {staking.token !== "EMMET" && <ZeroFeeBanner /> }
          <ul className="stakTotal stakList">
            <li>
              <p className="grayText">Maturity Date</p>
              <div>{`${new Date(Date.now() + (activeItem + 1) * 3 * 30.5 * 24 * 60 * 60 * 1000).toDateString()}`}</div>
            </li>
            <li>
              <p className="grayText">Estimated Rewards</p>
              <div>{staking.estimatedReward
                ? staking.estimatedReward.toLocaleString() + ` ${staking.token}`
                : 0 + ` ${staking.token}`}
              </div>
            </li>
          </ul>
        </div>
        <button
          className="yellowBtn"
          id="stakeBtn"
          disabled={disabled}
          onClick={switchAction}
        >
          {isAwaiting && <ButtonSpinner />}
          {caption}
        </button>
      </div>
    </div>
  );
}

export default Stake;