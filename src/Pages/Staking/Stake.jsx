import React, { useState } from 'react';

function Stake() {
  // State to track the active staking item
  const [activeItem, setActiveItem] = useState(null);

  // Function to handle item click
  const handleItemClick = (index) => {
    setActiveItem(index);
  };

  return (
    <div className="stake stakeBox">
      <div className="stakeHeader">Stake $EMMET</div>
      <div className="stakeBody">
        <div className="emmentAmount">
          <div className="emmentAmountTitle">
            <p className="grayText">Enter $EMMET amount</p>
            <h4>892.06 EMMET Available</h4>
          </div>
          <div className="enter_amount">
            <input type="number" value="50" placeholder="" />
            <span className="max_amount">MAX</span>
          </div>
        </div>
        <div className="selectStaking">
          <p className="grayText">Select staking period</p>
          <ul className="stakingList">
            {[
              { duration: "3 months", apy: "45%" },
              { duration: "6 months", apy: "75%" },
              { duration: "9 months", apy: "100%" },
              { duration: "1 year", apy: "125%" },
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
              <p className="grayText">End Date</p>
              <div>Estimated Rewards</div>
            </li>
            <li>
              <p className="grayText">End Date</p>
              <div>358 XPNET <span>$ 0.070</span></div>
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