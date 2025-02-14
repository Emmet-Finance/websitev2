import React from 'react'

function StakeEmmet() {
    return (

        <div className="stakeEmmet stakeBox">
            <div className="stakeHeader">
                <img src="/img/Emmet-circle.svg" alt="Emmet" />
                EMMET
            </div>
            <div className="stakeBody">
                <div className="emmetTotal">
                    <p>Total amount</p>
                    <div>
                        <h2>159.04787643</h2>
                        <span>$EMMET</span>
                    </div>
                </div>
                <ul className="stakList rewardList">
                    <li>
                        <p>Reward amount</p>
                        <div className="textGreen">0.00140163</div>
                    </li>
                    <li>
                        <p>45%</p>
                        <div className="">45%</div>
                    </li>
                </ul>
                <div className="hrGray"></div>
                <ul className="stakList subscriptionList">
                    <li>
                        <p>Subscription date</p>
                        <div>2025-01-13 10:10</div>
                    </li>
                    <li>
                        <p>Interest end date</p>
                        <div>2025-01-13 10:10</div>
                    </li>
                </ul>
                <div className="emmetWithdw">
                    <button className="yellowBtn" disabled id="emmetWidhdraw">Withdraw</button>
                    <p>Available in 92 days</p>
                </div>
            </div>
        </div>
    );
}

export default StakeEmmet;