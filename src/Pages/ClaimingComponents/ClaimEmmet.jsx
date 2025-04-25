import React, { useEffect, useState } from 'react'
import { useAppSelector} from '../../hooks/storage';
import { modal } from "../../App";
import { useAccount } from "wagmi";
import { findChainfromName } from "../../utils";
import useTabVisibility from "../../hooks/useTabVisibility";
import ButtonSpinner from "../CommonComponents/Spinner/ButtonSpinner";
import useClaming from "../../hooks/useClaming";

const captionUnstake = "Claim";
const pendingMaturity = "Waiting for TGE";
const captionPending = "Processing...";
const nothingToClaim = "Nothing to claim";

function ClaimEmmet() {

    const claiming = useAppSelector(state => state.claiming);
    const { isAwaiting, claim} = useClaming();

    const isClaiming = window.location.href.includes("/claiming");
    const { isTabActive } = useTabVisibility();
    const { isConnected, account } = useAccount();

    const [caption, setCaption] = useState(pendingMaturity);
    const [disabled, setDisabled] = useState(true);
    const [pendingInfo, setPendingInfo] = useState("TGE is on...");

    useEffect(() => {
        if (isTabActive && isClaiming && modal.getChainId() !== 56) {
          // modal.switchNetwork(findChainfromName(stakingChain));
          modal.switchNetwork(findChainfromName("BSC"));
        }
      }, [isConnected, account, modal.getChainId()]);

    useEffect(() => {

        if(isAwaiting){
            setCaption(captionPending);
            setDisabled(true);
        } else if (claiming.claimable) {
            setPendingInfo("Claiming is open");
            setCaption(captionUnstake);
            setDisabled(false);
        } else if(claiming.claimable === 0
                && claiming.positions 
                && claiming.positions.locked === 0 
                && claiming.positions.unlocked === 0
            ){
            setCaption(nothingToClaim);
            setDisabled(true);
            setPendingInfo("");

        } else {
            setCaption(pendingMaturity);
            setDisabled(true);

        }

    }, [claiming.claimable, isAwaiting, claiming.positions])

    return (

        <div className="stakeEmmet stakeBox">
            <div className="stakeHeader justify-cpace-between">
                Token Claiming

            </div>
            <div className="stakeBody">
                <div className="emmetTotal">
                    <p>Claimable tokens</p>
                    <div>
                        <h4>{claiming.claimable
                            ? Number(claiming.claimable).toLocaleString()
                            : 0
                        }</h4>
                        <h4>$EMMET</h4>
                    </div>
                </div>
                <ul className="stakList rewardList">
                    <li>
                        <p>Locked</p>
                        <div className="textGreen">
                        {
                                claiming.positions && claiming.positions.locked
                                    ? claiming.positions.locked.toLocaleString()
                                    : 0
                            }
                        </div>
                    </li>
                    <li>
                        <p>Unocked</p>
                        <div className="textGreen">
                            {
                                claiming.positions && claiming.positions.unlocked
                                    ? claiming.positions.unlocked.toLocaleString()
                                    : 0
                            }
                        </div>
                    </li>
                </ul>
                <div className="hrGray"></div>
                <ul className="stakList subscriptionList">
                 
                </ul>
                <div className="emmetWithdw">
                    <button
                        className="yellowBtn"
                        disabled={disabled}
                        id="emmetWidhdraw"
                        onClick={claim}
                    >
                        {isAwaiting && <ButtonSpinner />}
                        {caption}
                    </button>
                    {caption !== pendingMaturity && <p>{pendingInfo}</p>}

                </div>
            </div>
        </div>
    );
}

export default ClaimEmmet;