import React from 'react'
import "./Staking/Staking.css";
import StakingHeader from '../HeaderFooterSidebar/WebHeaderFooter/StakingHeader';
import Stake from './Staking/Stake';
import StakeEmmet from './Staking/StakeEmmet';
import StakeFAQ from './Staking/StakeFAQ';


function Staking() {
    return ( 
        <div className="stakingWrap">
            <div className="stakingHeader">
                <StakingHeader/>
            </div>
            <div className="stakingPageContent">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6">
                            <Stake/>
                        </div>
                        <div className="col-lg-6">
                            <StakeEmmet/>
                            <StakeFAQ/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
     );
}

export default Staking;