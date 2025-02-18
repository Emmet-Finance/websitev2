import React, { useEffect, useState } from 'react';
import { useAccount } from "wagmi";
import { useAppKit } from '@reown/appkit/react';
import { useAppSelector, useAppDispatch } from '../../hooks/storage';
import ButtonSpinner from "../CommonComponents/Spinner/ButtonSpinner";
import { modal } from "../../App";
import { findChainfromName } from "../../utils";
import useTabVisibility from "../../hooks/useTabVisibility";
import useStaking from "../../hooks/useStaking";
import { setAmount, setPeriod } from "../../store/stakingSlice";

const insufficientBalance = "Insufficient balance"
const captionApprove = "Approve";
const captionBuy = "Buy Tokens";
const connectWallet = "Connect your BSC wallet";

function Stake() {
  const staking = useAppSelector(state => state.staking);
  const { open } = useAppKit();
  const dispatch = useAppDispatch();
  const { isConnected, account } = useAccount();
  const { approve, isAwaiting, txHash, stake, unstake, withdrawRewards } = useStaking();

  // State to track the active staking item
  const [activeItem, setActiveItem] = useState(3);
  const [caption, setCaption] = useState("Enter Amount");
  const [showSpinner, setShowSpiner] = useState(false);
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
    if (amount) {
      setOldAmount(amount);
      dispatch(setAmount(amount))
    } else {
      dispatch(setAmount(oldAmount))
    }
  }, [amount])

  return (
    <div className="stake stakeBox">
      <div className="stakeHeader">Stake $EMMET</div>
      <div className="stakeBody">
        <div className="emmentAmount">
          <div className="emmentAmountTitle">
            <p className="grayText">Enter $EMMET amount</p>
            <h4>{staking.balance ? staking.balance.toLocaleString() : 0} EMMET Available</h4>
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
          <ul className="stakTotal stakList">
            <li>
              <p className="grayText">Maturity Date</p>
              <div>{`${new Date(Date.now() + (activeItem+1) * 3 * 30.5 * 24 * 60 * 60 * 1000).toDateString()}`}</div>
            </li>
            <li>
              <p className="grayText">Estimated Rewards</p>
              <div>{staking.estimatedReward
                ? staking.estimatedReward.toLocaleString() + ` EMMET`
                : 0 + ` EMMET`}
                <span> {staking.estimatedReward
                  ? `$${Number(staking.estimatedReward) * 0.01}`
                  : <>$ 0.00</>
                  } </span></div>
            </li>
          </ul>
        </div>
        <button className="yellowBtn" id="stakeBtn">
          Stake
        </button>
      </div>
    </div>
  );
}

export default Stake;