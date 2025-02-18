import React from 'react';
import { Helmet } from "react-helmet-async";
import "./Staking/Staking.css";
import StakingHeader from '../HeaderFooterSidebar/WebHeaderFooter/StakingHeader';
import Stake from './Staking/Stake';
import StakeEmmet from './Staking/StakeEmmet';
import StakeFAQ from './Staking/StakeFAQ';


function Staking() {
    return (<>
        <Helmet>
            <title>Token Staking | Emmet.Finance</title>
            <meta property="og:title" content="Token Sale | Emmet.Finance" />
            <meta property="og:description" content="Emmet Finance Token Staking – Join the Future of Cross-Chain DeFi! Participate in the Emmet Token Sale and be part of a revolutionary cross-chain DeFi hub. Emmet Finance enables seamless asset transfers between Ethereum, Bitcoin, TON, Solana, BSC, and more. Secure your allocation and support decentralized finance innovation." />
            <meta name="description" content="Emmet Finance Token Staking – Join the Future of Cross-Chain DeFi! Participate in the Emmet Token Sale and be part of a revolutionary cross-chain DeFi hub. Emmet Finance enables seamless asset transfers between Ethereum, Bitcoin, TON, Solana, BSC, and more. Secure your allocation and support decentralized finance innovation." />
        </Helmet>
        <div className="stakingWrap">
            <div className="stakingHeader">
                <StakingHeader />
            </div>
            <div className="stakingPageContent">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6">
                            <Stake />
                        </div>
                        <div className="col-lg-6">
                            <StakeEmmet />
                            <StakeFAQ />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>

    );
}

export default Staking;