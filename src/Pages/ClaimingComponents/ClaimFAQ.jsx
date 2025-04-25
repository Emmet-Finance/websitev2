import React from 'react'
import Accordion from 'react-bootstrap/Accordion';
import { useAppSelector } from '../../hooks/storage';

function ClaimFAQ() {

  const staking = useAppSelector(state => state.staking);

  return (
    
    <div className="stakeBox stakFaq">
        <div className="stakeHeader">
            FAQ
        </div>
        <div className="stakeBody">
            <Accordion defaultActiveKey="0">
                <Accordion.Item eventKey="0">
                    <Accordion.Header>Why I cannot withdraw all my ${staking.token} at once?</Accordion.Header>
                    <Accordion.Body>
                        Half of the tokens are available immediately. Half will open after TGE.
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                    <Accordion.Header>When is the TGE date?</Accordion.Header>
                    <Accordion.Body>
                        It will be announced in the Telegram announcement group.
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </div>
    </div>


  );
}

export default ClaimFAQ;