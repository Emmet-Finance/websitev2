import React from 'react'
import Accordion from 'react-bootstrap/Accordion';

function StakeFAQ() {
  return (
    
    <div className="stakeBox stakFaq">
        <div className="stakeHeader">
            FAQ
        </div>
        <div className="stakeBody">
            <Accordion defaultActiveKey="0">
                <Accordion.Item eventKey="0">
                    <Accordion.Header>Why stake $EMMET</Accordion.Header>
                    <Accordion.Body>
                        Lorem ipsum
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                    <Accordion.Header>When can i claim the reward</Accordion.Header>
                    <Accordion.Body>
                        Lorem ipsum
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </div>
    </div>


  );
}

export default StakeFAQ;