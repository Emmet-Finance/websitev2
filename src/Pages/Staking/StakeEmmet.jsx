import React, { useEffect, useState } from 'react'
import { useAppSelector, useAppDispatch } from '../../hooks/storage';
import { estimateRewards, setSelPosition } from "../../store/stakingSlice";
import { timeToMaturity, calculateTtlRewards, computeUnclaimedRewards } from "tokensale.sdk";
import ButtonSpinner from "../CommonComponents/Spinner/ButtonSpinner";
import { isMobile } from "react-device-detect";
import useStaking from "../../hooks/useStaking";

const captionWithdrawRewards = "Withdraw Rewards";
const captionUnstake = "Unstake";
const pendingMaturity = "Pending maturity";
const captionNoStaked = "No Active Stakes";

function StakeEmmet() {

    const staking = useAppSelector(state => state.staking);
    const dispatch = useAppDispatch();
    const { isAwaiting, withdraw, withdrawRewards } = useStaking();

    const [caption, setCaption] = useState(captionWithdrawRewards);
    const [disabled, setDisabled] = useState(true);
    const [pendingInfo, setPendingInfo] = useState("Unstaking opens in...");
    const [unclaimed, setUnclaimed] = useState(0);

    useEffect(() => {

        if (staking.selPosition && staking.selPosition.locked) {
            setUnclaimed(computeUnclaimedRewards(
                staking.selPosition.locked,
                staking.selPosition.period,
                staking.selPosition.claimed,
                staking.selPosition.start
            ))
        }

        if (staking.selPosition
            && staking.selPosition.maturity
            && Date.now() > Number(staking.selPosition.maturity) * 1000
        ) {
            setPendingInfo("Unstaking is open");
            setCaption(captionUnstake);
            setDisabled(false);
        } else if (unclaimed > 0) {
            const estimation = timeToMaturity(staking.selPosition.maturity);

            setPendingInfo(`Unstaking opens in ${estimation.days ? estimation.days + " days" : ""
                } ${estimation.hours ? estimation.hours + " hours" : ""
                } ${estimation.minutes ? estimation.minutes + " minutes" : ""
                }`);
            setCaption(captionWithdrawRewards);
            setDisabled(false);
        } else if (staking.selPosition && staking.selPosition.start === 0) {
            setCaption(captionNoStaked);
            setDisabled(true);
        } else {
            setCaption(pendingMaturity);
            setDisabled(true);

            if (staking.selPosition && staking.selPosition.maturity) {
                const estimation = timeToMaturity(staking.selPosition.maturity);

                setPendingInfo(`Unstaking opens in ${estimation.days ? estimation.days + " days" : ""
                    } ${estimation.hours ? estimation.hours + " hours" : ""
                    } ${estimation.minutes ? estimation.minutes + " minutes" : ""
                    }`);
            }

        }

    }, [staking.selPosition])

    const leftArrowClick = () => {
        if (staking.selPosIndex > 0) {
            dispatch(setSelPosition(staking.selPosIndex - 1));
        } else {
            dispatch(setSelPosition(0));
        }
    }

    const rightArrowClick = () => {
        if (staking.selPosIndex + 1 < staking.positions.positions.length
        ) {
            dispatch(setSelPosition(staking.selPosIndex + 1));
        } else {
            dispatch(setSelPosition(staking.positions.positions.length - 1));
        }
    }

    const switchAction = () => {
        switch (caption) {
            case captionUnstake:
                withdraw(staking.selPosIndex);
                break;
            case captionWithdrawRewards:
                withdrawRewards(staking.selPosIndex);
                break;
            default:
                break;
        }
    }

    return (

        <div className="stakeEmmet stakeBox">
            <div className="stakeHeader justify-cpace-between">
                {!isMobile && <div>
                    <img src="/img/Emmet-circle.svg" alt="Emmet" className="padding-right-10" />
                    {` EMMET`}

                </div>}

                {caption !== captionNoStaked && <div className="position-index-container">
                    {
                        staking.positions && staking.positions.positions
                            ? (<>
                                <span style={{ color: "#888b92" }}>Positions:</span>
                                <span
                                    className="clickable-item"
                                    onClick={leftArrowClick}
                                >{`<`}</span>
                                {staking.positions.positions.map((v, i) =>
                                    <span
                                        className="clickable-item"
                                        key={i}
                                        onClick={() => dispatch(setSelPosition(i))}
                                    >{i + 1}</span>
                                )}
                                <span
                                    className="clickable-item"
                                    onClick={rightArrowClick}
                                >{`>`}</span>
                            </>)
                            : ""
                    }

                </div>}

            </div>
            <div className="stakeBody">
                <div className="emmetTotal">
                    <p>Staked amount</p>
                    <div>
                        <h4>{staking.selPosition
                            ? Number(staking.selPosition.locked).toLocaleString()
                            : 0
                        }</h4>
                        <h4>$EMMET</h4>
                    </div>
                </div>
                <ul className="stakList rewardList">
                    <li>
                        <p>Total Rewards</p>
                        <div className="textGreen">
                            {
                                staking.selPosition && staking.selPosition.locked
                                    ? calculateTtlRewards(staking.selPosition.locked, staking.selPosition.period).toLocaleString()
                                    : 0
                            }
                        </div>
                    </li>
                    <li>
                        <p>Unclaimed Rewards</p>
                        <div className="textGreen">
                            {
                                unclaimed
                                    ? unclaimed.toLocaleString()
                                    : 0
                            }
                        </div>
                    </li>
                    <li>
                        <p>Claimed Rewards</p>
                        <div className="">{
                            staking.selPosition
                                ? Number(staking.selPosition.claimed).toLocaleString()
                                : 0
                        }</div>
                    </li>
                </ul>
                <div className="hrGray"></div>
                <ul className="stakList subscriptionList">
                    <li>
                        <p>Staking date</p>
                        <div>{
                            staking.selPosition && staking.selPosition.start > 0
                                ? new Date(staking.selPosition.start * 1000).toISOString().replace("T", " ").slice(0, 16)
                                : ""
                        }</div>
                    </li>
                    <li>
                        <p>Maturity date</p>
                        <div>{
                            staking.selPosition && staking.selPosition.start > 0
                                ? new Date(staking.selPosition.maturity * 1000).toISOString().replace("T", " ").slice(0, 16)
                                : ""
                        }</div>
                    </li>
                </ul>
                <div className="emmetWithdw">
                    <button
                        className="yellowBtn"
                        disabled={disabled}
                        id="emmetWidhdraw"
                        onClick={switchAction}
                    >
                        {isAwaiting && <ButtonSpinner />}
                        {caption}
                    </button>
                    {caption !== captionNoStaked && <p>{pendingInfo}</p>}

                </div>
            </div>
        </div>
    );
}

export default StakeEmmet;