import React from 'react'
import Accordion from 'react-bootstrap/Accordion';
import { useAppSelector } from '../../hooks/storage';

function StakeFAQ() {

  const staking = useAppSelector(state => state.staking);

  return (
    
    <div className="stakeBox stakFaq">
        <div className="stakeHeader">
            FAQ
        </div>
        <div className="stakeBody">
            <Accordion defaultActiveKey="0">
                <Accordion.Item eventKey="0">
                    <Accordion.Header>Why stake ${staking.token}?</Accordion.Header>
                    <Accordion.Body>
                        Get passive income exceeding bank interest through staking rewards based on your locked amount and period.
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                    <Accordion.Header>When can I claim the reward?</Accordion.Header>
                    <Accordion.Body>
                        Rewards can be claimed in real time as they become available. Rewards are computed based on the staked amount & the locking period minus already claimed rewards.
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="2">
                    <Accordion.Header>When can I unstake?</Accordion.Header>
                    <Accordion.Body>
                        Unstaking opens once the stake matures. Any unclaimed rewards will be transferred alongside the stake upon unstaking. The position will be closed and deleted.
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </div>
    </div>


  );
}

export default StakeFAQ;